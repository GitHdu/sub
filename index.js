import fs from "fs";
import https from "https";
import fetch from "node-fetch";
import path from "path";

// const remoteUrl = 'https://api.subcloud.xyz/sub?target=clash&url=%E8%AE%A2%E5%8D%95&insert=false&config=https%3A%2F%2Fraw.githubusercontent.com%2FACL4SSR%2FACL4SSR%2Fmaster%2FClash%2Fconfig%2FACL4SSR_Online.ini&emoji=true&list=false&tfo=false&scv=false&fdn=false&sort=false&new_name=true';
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const localPath = path.join(__dirname, "./sub.yml");

const url =
  "https://api.github.com/repos/h7ml/okjiasu_action/contents/package/okjiasu/free";
fetch(url)
  .then((response) => response.json())
  .then((data) => {
    const latest = data[data.length - 1];
    fetch(latest.url)
      .then((response) => response.json())
      .then((data) => {
        const lastest = data[data.length - 1];
        fetch(lastest.url)
          .then((response) => response.json())
          .then((data) => {
            const content = Buffer.from(data.content, "base64").toString(
              "utf-8"
            );
            const urls = JSON.parse(content).map((item) => item.detail.UUid);

            const uniqUrls = [...new Set(urls)];
            let sourceSub = uniqUrls.join("\n");
            sourceSub = sourceSub.replace(/(\n|\r|\n\r)/g, "|");

            const subUrl = `https://sub.id9.cc/sub?target=clash&url=${encodeURIComponent(
              sourceSub
            )}&insert=false&config=https%3A%2F%2Fraw.githubusercontent.com%2FACL4SSR%2FACL4SSR%2Fmaster%2FClash%2Fconfig%2FACL4SSR_Online.ini`;
            console.log(subUrl);
            https
              .get(subUrl, (res) => {
                let data = "";
                res.on("data", (chunk) => {
                  data += chunk;
                });
                res.on("end", async () => {
                  await fs.writeFileSync(localPath, data, {
                    encoding: "utf8",
                    flag: "w",
                  });
                  console.log("文件已保存");
                });
              })
              .on("error", (err) => {
                console.log("获取远程文件失败: " + err.message);
              });
          });
      });
  })
  .catch((error) => console.error(error));
