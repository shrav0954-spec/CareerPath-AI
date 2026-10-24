"""
CareerPath AI - Backend Integration Test Script
Tests connectivity, health check, and analysis endpoints.
Supports both local FastAPI server and deployed Render backend.

Usage:
  python test-backend-integration.py
  python test-backend-integration.py --url https://your-app.onrender.com
"""

import sys
import json
import argparse
import urllib.request
import urllib.error

def test_endpoint(name, url, method="GET", data=None, headers=None):
    print(f"\n[TESTING] {name} -> {url}")
    if headers is None:
        headers = {}
    
    req_data = None
    if data is not None:
        req_data = json.dumps(data).encode("utf-8")
        headers["Content-Type"] = "application/json"
    headers["Accept"] = "application/json"
    
    req = urllib.request.Request(url, data=req_data, headers=headers, method=method)
    try:
        with urllib.request.urlopen(req, timeout=45) as response:
            status_code = response.getcode()
            body = response.read().decode("utf-8")
            parsed = json.loads(body)
            print(f"  ✓ Status {status_code} OK")
            print(f"  ✓ Response sample: {json.dumps(parsed, indent=2)[:300]}...")
            return True, parsed
    except urllib.error.HTTPError as e:
        print(f"  ✗ HTTP Error {e.code}: {e.read().decode('utf-8', errors='ignore')}")
        return False, None
    except urllib.error.URLError as e:
        print(f"  ✗ Connection Error: {e.reason}")
        print("    (Note: If Render free tier was inactive, it may take 30-50s to wake up)")
        return False, None
    except Exception as e:
        print(f"  ✗ Unexpected Error: {str(e)}")
        return False, None

def main():
    parser = argparse.ArgumentParser(description="Test CareerPath AI Backend API")
    parser.add_argument("--url", default="http://127.0.0.1:8000", help="Base URL of the backend")
    args = parser.parse_args()

    base_url = args.url.rstrip("/")
    print(f"==================================================")
    print(f"  CareerPath AI - Integration Test Suite")
    print(f"  Target URL: {base_url}")
    print(f"==================================================")

    # Test 1: Root endpoint
    test_endpoint("Root Status", f"{base_url}/")

    # Test 2: Health Check endpoint
    success, health_data = test_endpoint("Health Check (/api/health)", f"{base_url}/api/health")

    # Test 3: Text Analysis endpoint
    sample_text = (
        "Software Engineer with 2 years of experience in Python, Django, PostgreSQL, "
        "and RESTful APIs. Built web services handling thousands of daily queries. "
        "Familiar with Git, Docker, and Agile development methodologies."
    )
    test_endpoint(
        "Analyze Resume Text (/api/analyze-text)",
        f"{base_url}/api/analyze-text",
        method="POST",
        data={
            "resume_text": sample_text,
            "target_role": "Python Developer"
        }
    )

    print("\n==================================================")
    print("  Test run completed!")
    print("==================================================")

if __name__ == "__main__":
    main()
