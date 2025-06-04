import { BadRequestException, Injectable } from "@nestjs/common";
import * as multer from 'multer'
import * as fs from 'fs'
import { MulterRequest } from "src/types/multerRequest";


@Injectable()
export class FileService {
    async uploadFile(req: MulterRequest, folder = '/'): Promise<{ file: any[]; body: any }> {
        const storage = multer.diskStorage({
            destination: (req, file, cb) => {
                const path = `uploads/${folder}`;
                fs.mkdirSync(path, { recursive: true });
                cb(null, path);
            },
            filename: (req, file, cb) => {
                cb(null, `${Date.now()}-${file.originalname.replace(/\s/g, '')}`);
            }
        });

        const upload = multer({ storage }).any();

        return new Promise((resolve, reject) => {
            upload(req, {} as any, async (err) => {
                if (err) return reject(err);

                try {
                    const files = req.files && req.files.length > 0
                        ? req.files.map((file) => ({
                            ...file,
                            path: `${process.env.MULTER}${file.path.replace(/\\/g, '/')}`
                        }))
                        : []
                    resolve({ body: req.body, file: files })
                } catch (error) {
                    reject(error)
                }
            });
        });
    };

    async removeFile(files: any): Promise<void> {
        if (!files) {
            console.error("No files for delection");
        };

        try {
            if (Array.isArray(files)) {
                files.forEach((file) => {
                    const path = file.path ? file.path.replace(process.env.MULTER, '') : file.replace(process.env.MULTER, '');
                    fs.unlinkSync(path);
                    console.log("Files Deleted");
                });
            } else {
                const path = files.path ? files.path.replace(process.env.MULTER) : files.replace(process.env.MULTER, '');
                fs.unlinkSync(path);
                console.log("File Deleted");
            };
        } catch (error) {
            console.log(error)
            throw new BadRequestException(error.message)
        };
    };
}