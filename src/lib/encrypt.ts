// 生成加密密钥的函数
async function getKey(password, salt) {
  const encoder = new TextEncoder();
  const keyMaterial = await window.crypto.subtle.importKey(
    'raw',
    encoder.encode(password),
    { name: 'PBKDF2' },
    false,
    ['deriveBits', 'deriveKey']
  );

  return await window.crypto.subtle.deriveKey(
    {
      name: 'PBKDF2',
      salt: salt,
      iterations: 100000,
      hash: 'SHA-256'
    },
    keyMaterial,
    { name: 'AES-GCM', length: 256 },
    false,
    ['encrypt', 'decrypt']
  );
}


export async function encryptData(data: string, password: string) {
  try {
    const encoder = new TextEncoder();
    const salt = window.crypto.getRandomValues(new Uint8Array(16));
    const iv = window.crypto.getRandomValues(new Uint8Array(12));

    const key = await getKey(password, salt);
    const encryptedData = await window.crypto.subtle.encrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      encoder.encode(data)
    );

    // 组合salt、iv和加密数据
    const combined = new Uint8Array(salt.length + iv.length + encryptedData.byteLength);
    combined.set(salt);
    combined.set(iv, salt.length);
    combined.set(new Uint8Array(encryptedData), salt.length + iv.length);

    // 转换为Base64字符串
    const base64 = btoa(String.fromCharCode.apply(null, combined));
    // console.log('base64>>', base64)

    return base64

    // 自动解密以验证
    // await decryptData(base64, password);
  } catch (error) {
    console.error('加密错误:', error);
    alert('加密失败: ' + error.message);
    return ''
  }
}

// 解密函数
export async function decryptData(encryptedData, password) {
  try {
    // 从Base64解码
    const binaryString = atob(encryptedData);
    const binaryData = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      binaryData[i] = binaryString.charCodeAt(i);
    }

    // 提取salt、iv和加密数据
    const salt = binaryData.slice(0, 16);
    const iv = binaryData.slice(16, 28);
    const data = binaryData.slice(28);

    const key = await getKey(password, salt);
    const decrypted = await window.crypto.subtle.decrypt(
      {
        name: 'AES-GCM',
        iv: iv
      },
      key,
      data
    );

    const decoder = new TextDecoder();
    return decoder.decode(decrypted);
  } catch (error) {
    console.error('解密错误:', error);
    return '解密失败: 密码错误或数据损坏';
  }
}