import fs from "fs";
import https from "https";
import fetch from "node-fetch";
import path from "path";

// const remoteUrl = 'https://sub.id9.cc/sub?target=clash&url=trojan%3A%2F%2F077adafc-77cf-3c92-94b8-5594ff120ae5%40ae2.aliyunsj.cn%3A37520%23%25F0%259F%259F%25A2%25F0%259F%2587%25A6%25F0%259F%2587%25AA%25E8%25BF%25AA%25E6%258B%259C%25202%2520%257CNF&insert=false&config=https%3A%2F%2Fraw.githubusercontent.com%2FACL4SSR%2FACL4SSR%2Fmaster%2FClash%2Fconfig%2FACL4SSR_Online.ini';
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

            const subUrl = `https://sub.id9.cc/sub?target=clash&new_name=true&url=${encodeURIComponent(
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
                  await fs.writeFileSync(localPath, `\uFEFF${data}`);
                  console.log(`${Date.now()} : 写入到${localPath} 完毕`);
                });
              })
              .on("error", (err) => {
                console.log("获取远程文件失败: " + err.message);
              });
          });
      });
  })
  .catch((error) => console.error(error));
