import {UploadToIpfs} from "~/composables/UploadToIpfs";

interface UploadToIpfsAnswer {
  data: string;
  status: number;
}

export default defineEventHandler(async (event): Promise<UploadToIpfsAnswer> => {
  console.log("upload ipfs called");
  const { image } = await readBody(event);
  const config = useRuntimeConfig();
  const ipfs_answer = await UploadToIpfs(image, config.PINATA_JWT);
  console.log("ipfs_answer = ", JSON.stringify(ipfs_answer));
  if (ipfs_answer === null) {
    return {
      data: JSON.stringify({ error: "error when uploading to ipfs" }),
      status: 500,
    };
  }
  return {
    data: JSON.stringify(ipfs_answer),
    status: 200,
  };
});