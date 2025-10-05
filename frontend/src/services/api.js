import axios from "axios";

const API_BASE = "http://localhost:8080"; // Spring Boot backend adresin

// Giriş (login)
export const loginUser = async ({ username, password }) => {
  try {
    const response = await axios.post(`${API_BASE}/auth/login`, { username, password });
    let data = response.data;
    if (typeof data === "string") {
      data = JSON.parse(
        data.replace(/([a-zA-Z0-9_]+)\s*=/g, '"$1":').replace(/'/g, '"')
      );
    }
    
    localStorage.setItem("token", data.token);
    localStorage.setItem("refreshToken", data.refreshToken);
    localStorage.setItem("username", username);
    
    // Kullanıcının rolünü almak için ayrı bir API çağrısı yapıyoruz
    try {
      const userInfo = await getUserInfo(username, data.token);
      localStorage.setItem("role", userInfo.role?.name || userInfo.role);
    } catch (err) {
      console.log("Rol bilgisi alınamadı, varsayılan olarak NormalUser atanıyor");
      localStorage.setItem("role", "NormalUser");
    }
    
    return { data };
  } catch (err) {
    throw err;
  }
};

// Kullanıcı bilgisini almak için yardımcı fonksiyon
const getUserInfo = async (username, token) => {
  const response = await axios.get(`${API_BASE}/api/user/get-all-users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  const users = response.data;
  return users.find(u => u.username === username) || {};
};

// Kullanıcı kayıt (register)
export const registerUser = async ({ username, password, email, phone }) => {
  return axios.post(`${API_BASE}/auth/register`, { username, password, email, phone });
};

// Logout (quit)
export const logoutUser = async () => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE}/auth/quit`, {}, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Token yenile (refresh)
export const refreshToken = async (refreshToken) => {
  return axios.post(`${API_BASE}/api/user/refresh-token`, { refreshToken });
};

// Şifre değiştir
export const changePassword = async (newPassword) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE}/api/user/change-password`, { newPassword }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Admin: Tüm kullanıcıları getir
export const getUsers = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE}/api/user/get-all-users`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Admin: Kullanıcı ekle
export const addUser = async ({ username, password, email, phone, status, role }) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE}/api/user/add-user`, { username, password, email, phone, status, role }, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Admin: Kullanıcı sil
export const deleteUser = async (username) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE}/api/user/delete-user`, username, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

// Admin: Kullanıcıyı pasife al
export const markUserInactive = async (username) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE}/api/user/mark-user-inactive`, username, {
    headers: { 
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    }
  });
};

// Admin: Kullanıcı güncelle
export const updateUserAdmin = async (updateUserRequestAdmin) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE}/api/user/update-user-admin`, updateUserRequestAdmin, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Kullanıcı kendi bilgisini günceller
export const updateUser = async (updateUserRequest) => {
  const token = localStorage.getItem("token");
  return axios.post(`${API_BASE}/api/user/update-user`, updateUserRequest, {
    headers: { Authorization: `Bearer ${token}` },
  });
};

// Admin: Kullanıcı loglarını getir
export const getUserLogs = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE}/api/user/get-user-logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Admin: Hata loglarını getir
export const getErrorLogs = async () => {
  const token = localStorage.getItem("token");
  const response = await axios.get(`${API_BASE}/api/user/get-error-logs`, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

// Rolleri getir (Role tablosunda varsa)
export const getRoles = async () => {
  // Eğer özel endpoint'in yoksa, bir mock dönebilir ya da backend'e endpoint eklenmeli!
  // return axios.get(`${API_BASE}/api/user/get-roles`);
  return Promise.resolve({
    data: [
      { id: 1, name: "Admin" },
      { id: 2, name: "NormalUser" },
    ],
  });
};