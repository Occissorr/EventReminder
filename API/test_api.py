import requests

BASE_URL = "http://127.0.0.1:5000"

def test_send_otp(email):
    url = f"{BASE_URL}/send-otp"
    payload = {'email': email}
    response = requests.post(url, json=payload)
    print(f"Send OTP Response: {response.json()}")
    return response.json()

def test_verify_otp(email, otp):
    url = f"{BASE_URL}/verify-otp"
    payload = {'email': email, 'otp': otp}
    response = requests.post(url, json=payload)
    print(f"Verify OTP Response: {response.json()}")
    return response.json()

if __name__ == "__main__":
    test_email = "test@example.com"
    
    # Test sending OTP
    send_otp_response = test_send_otp(test_email)
    
    # Assuming OTP is printed in the server logs or you have access to it
    test_otp = input("Enter the OTP received on email: ")
    
    # Test verifying OTP
    verify_otp_response = test_verify_otp(test_email, test_otp)
