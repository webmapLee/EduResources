/**
 * 下载books.json中的封面图片到本地
 * 并更新books.json中的图片引用
 */
import fs from 'fs';
import path from 'path';
import axios from 'axios';
import { fileURLToPath } from 'url';

// 获取当前文件的目录路径
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 文件路径
const booksJsonPath = path.join(__dirname, '../data/books.json');
const publicImagesDir = path.join(__dirname, '../../public/images/books');

// 确保目标目录存在
if (!fs.existsSync(publicImagesDir)) {
  fs.mkdirSync(publicImagesDir, { recursive: true });
  console.log(`创建目录: ${publicImagesDir}`);
}

// 读取books.json
const booksData = JSON.parse(fs.readFileSync(booksJsonPath, 'utf8'));

// 下载图片的函数
async function downloadImage(url, imagePath) {
  try {
    // 如果URL已经是本地路径，则跳过
    if (url.startsWith('/images/')) {
      console.log(`跳过已经是本地路径的图片: ${url}`);
      return url;
    }

    const response = await axios({
      method: 'GET',
      url: url,
      responseType: 'stream',
      headers: {
        'Referer': 'https://book.douban.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
      }
    });

    // 创建写入流并保存图片
    const writer = fs.createWriteStream(imagePath);
    response.data.pipe(writer);

    return new Promise((resolve, reject) => {
      writer.on('finish', () => {
        console.log(`图片下载成功: ${imagePath}`);
        resolve(true);
      });
      writer.on('error', (err) => {
        console.error(`图片下载失败: ${url}`, err);
        reject(err);
      });
    });
  } catch (error) {
    console.error(`下载图片出错: ${url}`, error.message);
    return false;
  }
}

// 处理所有图书并更新引用
async function processBooks() {
  let updated = false;

  for (const category of booksData.categories) {
    for (const book of category.books) {
      // 检查是否有封面图片URL
      if (book.cover && book.cover.startsWith('http')) {
        // 生成文件名和路径
        const fileName = `${book.id}.jpg`;
        const imagePath = path.join(publicImagesDir, fileName);
        const relativeImagePath = `/images/books/${fileName}`;

        // 下载图片
        console.log(`下载图片: ${book.title} - ${book.cover}`);
        const result = await downloadImage(book.cover, imagePath);

        if (result) {
          // 更新JSON中的引用
          book.cover = relativeImagePath;
          updated = true;
        }
      }
    }
  }

  // 如果有更新，保存回JSON文件
  if (updated) {
    fs.writeFileSync(booksJsonPath, JSON.stringify(booksData, null, 2), 'utf8');
    console.log('books.json 已更新完成');
  } else {
    console.log('没有需要更新的图片');
  }
}

// 执行主函数
processBooks().catch(err => {
  console.error('处理过程中出错:', err);
});