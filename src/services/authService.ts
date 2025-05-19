// src/services/authService.ts
import axios from 'axios';

// 假设API端点
const API_URL = import.meta.env.VITE_API_URL || 'https://api.example.com';

export interface LoginResponse {
  token: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
    phone?: string;
  };
}

export interface PhoneCodeParams {
  phone: string;
  code: string;
}

export interface WechatLoginParams {
  code: string;
}

/**
 * 发送手机验证码
 * @param phone 手机号码
 */
export const sendPhoneCode = async (phone: string): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_URL}/auth/send-code`, { phone });
    return response.data.success;
  } catch (error) {
    console.error('发送验证码失败:', error);
    throw error;
  }
};

/**
 * 手机验证码登录
 * @param params 手机号和验证码
 */
export const loginWithPhoneCode = async (params: PhoneCodeParams): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login/phone`, params);
    return response.data;
  } catch (error) {
    console.error('手机验证码登录失败:', error);
    throw error;
  }
};

/**
 * 获取微信登录URL
 */
export const getWechatLoginUrl = (): string => {
  const appId = import.meta.env.VITE_WECHAT_APP_ID;
  const redirectUri = encodeURIComponent(window.location.origin + '/wechat-callback');
  return `https://open.weixin.qq.com/connect/qrconnect?appid=${appId}&redirect_uri=${redirectUri}&response_type=code&scope=snsapi_login&state=${Math.random().toString(36).substring(2, 15)}#wechat_redirect`;
};

/**
 * 微信登录
 * @param params 微信授权码
 */
export const loginWithWechat = async (params: WechatLoginParams): Promise<LoginResponse> => {
  try {
    const response = await axios.post(`${API_URL}/auth/login/wechat`, params);
    return response.data;
  } catch (error) {
    console.error('微信登录失败:', error);
    throw error;
  }
};