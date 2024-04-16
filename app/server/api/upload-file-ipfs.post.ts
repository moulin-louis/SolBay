import {Result, readFiles} from 'h3-formidable';
import {writeFile, mkdtemp} from 'fs/promises';
import {tmpdir} from 'os';
import {join} from 'path';

export const UploadToIpfs = async (data: File): Promise<any> => {
  try {
    const config = useRuntimeConfig();
    const ImageData = new FormData();
    ImageData.append('file', data);
    const pinataMetadata = JSON.stringify({
      name: 'Auction Image',
    });
    ImageData.append('pinataMetadata', pinataMetadata);
    const res = await fetch('https://api.pinata.cloud/pinning/pinFileToIPFS', {
      method: 'POST',
      headers: {Authorization: `Bearer ${config.PINATA_JWT}`},
      body: ImageData,
    });
    console.log('res : ', await res.json());
    if (!res.ok) throw new Error('Error uploading to pinata');
    return await res.json();
  } catch (error) {
    throw new Error('Error uploading to pinata');
  }
};

export default defineEventHandler(
  async (event): Promise<t_apiAnswer<string>> => {
    try {
      const {files}: Result = await readFiles(event, {});
      const tempDir = await mkdtemp(join(tmpdir(), 'uploads-'));
      console.log(`Temp dir created at ${tempDir}`);
      const filePath = join(tempDir, files.file[0].originalFilename);
      console.log(`filePath =  ${filePath}`);
      console.log('data = ', files.file[0]);
      await writeFile(filePath, Buffer.from(files.file));
      console.log(`File written to ${filePath}`);
      const ipfs_answer = await UploadToIpfs(files['file[0]']);
      return {
        status: 200,
        data: '',
      };
    } catch (e) {
      const error = e as Error;
      console.log('error in upload ipfs: ', error.message);
      return {
        status: 500,
        data: JSON.stringify({error: error.message}),
      };
    }
  },
);
