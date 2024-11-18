// src/utils/aeon.ts
export const generateOrderKey = (userId: string) => {
    return `${userId}_${Date.now()}`;
  };
  
  export const generateAeonResError = (message: string, code: string) => {
    return {
      code,
      message,
      success: false
    };
  };
  
  export const openAeonPayment = (res: any) => {
    if (res?.model?.webUrl) {
      window.open(res.model.webUrl, '_blank');
    }
  };
  
  export const createAeonOrdersWithTma = async (orderData: any, additionalData?: any) => {
    try {
      // Здесь реализация создания заказа через Aeon API
      const response = await fetch('YOUR_AEON_API_ENDPOINT', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ...orderData,
          ...additionalData
        })
      });
      
      return await response.json();
    } catch (error) {
      console.error('Error creating Aeon order:', error);
      return null;
    }
  };