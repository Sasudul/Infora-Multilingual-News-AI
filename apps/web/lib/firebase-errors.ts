export function getAuthErrorMessage(error: any): string {
  const code = error?.code;
  
  if (!code) {
    // Fallback if no code is present, try to clean up the raw message
    const msg = error?.message || 'An unexpected error occurred. Please try again.';
    return msg.replace(/^Firebase:\s*/, '').replace(/\s*\(auth\/.*\)\.?$/, '') || msg;
  }

  switch (code) {
    case 'auth/invalid-credential':
    case 'auth/user-not-found':
    case 'auth/wrong-password':
      return 'Invalid email or password. Please check your credentials and try again.';
    case 'auth/email-already-in-use':
      return 'An account with this email address already exists. Please sign in instead.';
    case 'auth/weak-password':
      return 'Your password is too weak. It must be at least 6 characters long.';
    case 'auth/invalid-email':
      return 'Please enter a valid email address.';
    case 'auth/popup-closed-by-user':
      return 'Sign-in window was closed before completion. Please try again.';
    case 'auth/invalid-verification-code':
      return 'The verification code you entered is incorrect. Please check and try again.';
    case 'auth/missing-verification-code':
      return 'Please enter the verification code sent to your phone.';
    case 'auth/invalid-phone-number':
      return 'Please enter a valid phone number including country code (e.g., +94).';
    case 'auth/too-many-requests':
      return 'Too many unsuccessful attempts. Please wait a few minutes and try again.';
    case 'auth/network-request-failed':
      return 'Network error. Please check your internet connection and try again.';
    case 'auth/quota-exceeded':
      return 'SMS quota exceeded. Please try using email sign-in for now.';
    case 'auth/operation-not-allowed':
      return 'This sign-in method is currently disabled. Please contact support.';
    case 'auth/credential-already-in-use':
      return 'This credential is already linked to another account.';
    default:
      // Try to clean up standard Firebase error messages
      const msg = error?.message || 'An unexpected error occurred. Please try again.';
      return msg.replace(/^Firebase:\s*/, '').replace(/\s*\(auth\/.*\)\.?$/, '');
  }
}
