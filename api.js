import { ENDPOINTS } from '../config';

/**
 * Checks backend health and connectivity.
 * Used by Topbar status indicator.
 */
export async function checkBackendHealth() {
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 8000);

    const response = await fetch(ENDPOINTS.HEALTH, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        online: false,
        status: response.status,
        message: `Backend returned status ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      online: true,
      data,
    };
  } catch (err) {
    return {
      online: false,
      message: err.name === 'AbortError'
        ? 'Backend response timed out (if using Render free tier, server may be waking up)'
        : err.message || 'Unable to reach backend server',
    };
  }
}

/**
 * Submits resume file + target role for AI career analysis.
 * Preserves the exact backend multipart format:
 * - Field "resume": UploadFile (.pdf, .docx, .txt)
 * - Field "target_role": str
 */
export async function analyzeResume(file, targetRole) {
  if (!file) {
    throw new Error('Please upload your resume file.');
  }

  if (!targetRole || !targetRole.trim()) {
    throw new Error('Please select your target job role.');
  }

  // Validate extension
  const validExtensions = ['.pdf', '.docx', '.txt'];
  const fileNameLower = file.name.toLowerCase();
  const isValidExt = validExtensions.some(ext => fileNameLower.endsWith(ext));
  if (!isValidExt) {
    throw new Error('Please select a valid resume file (.pdf, .docx, or .txt).');
  }

  // Check 10MB limit (matching backend MAX_FILE_SIZE_MB)
  if (file.size > 10 * 1024 * 1024) {
    throw new Error('The maximum file size is 10 MB.');
  }

  const formData = new FormData();
  formData.append('resume', file);
  formData.append('target_role', targetRole.trim());

  let response;
  try {
    // 120s timeout to account for Render cold-starts or LLM generation
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 120000);

    response = await fetch(ENDPOINTS.ANALYZE, {
      method: 'POST',
      body: formData,
      signal: controller.signal,
    });

    clearTimeout(timeoutId);
  } catch (err) {
    if (err.name === 'AbortError') {
      throw new Error('Request timed out. If your backend is hosted on Render free tier, it may need 30-50 seconds to wake up.');
    }
    throw new Error(`Failed to connect to backend: ${err.message}. Please verify the backend is running and CORS is configured.`);
  }

  if (!response.ok) {
    let errorDetail = 'Analysis request failed.';
    try {
      const errJson = await response.json();
      if (errJson && errJson.detail) {
        errorDetail = typeof errJson.detail === 'string'
          ? errJson.detail
          : JSON.stringify(errJson.detail);
      }
    } catch {
      errorDetail = `Server responded with status ${response.status} (${response.statusText})`;
    }
    throw new Error(errorDetail);
  }

  return await response.json();
}

/**
 * Submits raw text for quick career analysis.
 */
export async function analyzeResumeText(resumeText, targetRole) {
  if (!resumeText || resumeText.trim().length < 50) {
    throw new Error('Resume text must be at least 50 characters.');
  }

  if (!targetRole || !targetRole.trim()) {
    throw new Error('Please select your target job role.');
  }

  const response = await fetch(ENDPOINTS.ANALYZE_TEXT, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
    },
    body: JSON.stringify({
      resume_text: resumeText.trim(),
      target_role: targetRole.trim(),
    }),
  });

  if (!response.ok) {
    const errJson = await response.json().catch(() => ({}));
    throw new Error(errJson.detail || `Request failed with status ${response.status}`);
  }

  return await response.json();
}
