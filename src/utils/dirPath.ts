import path from 'path';
import { fileURLToPath } from 'url'

const __dirname = path.dirname( fileURLToPath(import.meta.url) );


export const __srcDirName  = path.resolve(__dirname, '..');
// export const __publicDirName  = path.resolve(__srcDirName, '..', 'public' );
// export const __downloadsDirName  = path.resolve(__srcDirName, '..', 'downloads' );

export const getDirName = (moduleUrl: string) => {
    const filename = fileURLToPath(moduleUrl)
    return path.dirname(filename)
}