export const UploadToIpfs = async (data: File, api_jwt: string) => {
  const config = useRuntimeConfig();
  try {
    const formData = new FormData();
    formData.append('file', new Blob([data], {type: 'image/jpeg'}));
    formData.append("pinataMetadata", JSON.stringify({name: "auction_image"}));
    const res = await fetch(`https://api.pinata.cloud/pinning/pinFileToIPFS`, {
      method: 'POST',
      headers: {Authorization: `Bearer ${api_jwt}`},
      body: formData,
    });
    return res.json();
  } catch (error) {
    console.log('error when uploading to ipfs', error);
    return null;
  }
}