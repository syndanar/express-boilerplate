const {resolve} = require('path');
const fs = require('fs');

export interface GetFilesOptions {
  pattern?: RegExp,
  absolutePath?: boolean
}

/**
 * Get files in directory recursive
 * @param {string} dir
 * @param {GetFilesOptions} options
 * @return {Promise<string[]>}
 */
export async function getFiles(dir: string, options: GetFilesOptions): Promise<string[]> {
  const resultFiles: string[] = [];
  const searchDir = dir;
  const walkDir = (dir: string) => {
    const resources = fs.readdirSync(dir);
    resources.forEach((resource: string) => {
      const fullPath: string = resolve(dir, resource);
      const isDir = fs.statSync(fullPath).isDirectory();
      if (isDir) {
        walkDir(fullPath);
      } else {
        /** Generate fileName */
        const pushFileName: string = options.absolutePath ? fullPath : fullPath.substr(searchDir.length);

        /** Check match pattern if exists */
        if (options.pattern && !resource.match(options.pattern)) return;

        resultFiles.push(pushFileName);
      }
    });
  };
  await walkDir(dir);
  return resultFiles;
}
