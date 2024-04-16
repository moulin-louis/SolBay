export const UploadToIpfs = async (
  data: any,
  type_file: string,
): Promise<any> => {
  try {
    const config = useRuntimeConfig();
    const ImageData = new FormData();
    ImageData.append('file', new Blob([data.data], {type: type_file}));
    const pinataMetadata = JSON.stringify({
      name: 'Listing Image',
    });
    ImageData.append('pinataMetadata', pinataMetadata);
    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {Authorization: `Bearer ${config.PINATA_JWT}`},
      body: ImageData,
    });
    const res_json = await res.json();
    if (!res.ok) throw new Error(await res.text());
    return res_json.IpfsHash;
  } catch (e) {
    const error = e as Error;
    throw new Error('Error uploading to pinata:' + error.message);
  }
};
export default defineEventHandler(
  async (event): Promise<t_apiAnswer<string>> => {
    try {
      const mFormData = await readMultipartFormData(event);
      if (!mFormData) throw new Error('No data found');
      const file = mFormData?.find((item) => item.name == 'file');
      if (!file) throw new Error('File not found');
      const ipfs_answer = await UploadToIpfs(file, file.type as string);
      return {
        status: 200,
        data: ipfs_answer,
      };
    } catch (e) {
      const error = e as Error;
      console.log('error in upload ipfs: ', error.message);
      return {
        status: 500,
        data: error.message,
      };
    }
  },
);
