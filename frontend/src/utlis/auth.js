import blockchainEncryption from './blockchainEncryption';

export const getDecryptedToken = () => {
  const encryptedToken = localStorage.getItem('token');
  if (!encryptedToken) return null;
  
  try {
    return blockchainEncryption.decryptData(encryptedToken);
  } catch (error) {
    console.error('Token decryption error:', error);
    return null;
  }
};

export const getDecryptedUserData = () => {
  const encryptedUserData = localStorage.getItem('userData');
  if (!encryptedUserData) return null;
  
  try {
    return blockchainEncryption.decryptData(encryptedUserData);
  } catch (error) {
    console.error('User data decryption error:', error);
    return null;
  }
};

export const isAuthenticated = () => {
  const token = getDecryptedToken();
  return !!token;
};

export const getUserRole = () => {
  const userData = getDecryptedUserData();
  return userData ? userData.role : null;
};

export const getUserId = () => {
  const userData = getDecryptedUserData();
  return userData ? userData._id : null;
};