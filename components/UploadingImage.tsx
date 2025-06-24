"use client"

import React, { useEffect, useState } from 'react';
import { useDropzone } from 'react-dropzone';
import { Button } from './ui/button';



// Add basic inline styles (you can move this to Tailwind if you're using it)
const thumbsContainer: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 16
};

const thumb: React.CSSProperties = {
    display: 'inline-flex',
    borderRadius: 2,
    border: '1px solid #eaeaea',
    marginBottom: 8,
    marginRight: 8,
    width: 100,
    height: 100,
    padding: 4,
    boxSizing: 'border-box'
};

const thumbInner: React.CSSProperties = {
    display: 'flex',
    minWidth: 0,
    overflow: 'hidden'
};

const img: React.CSSProperties = {
    display: 'block',
    width: 'auto',
    height: '100%'
};

// Extend File type to include preview
type FileWithPreview = File & {
    preview: string;
};

const UploadImage: React.FC = () => {
    const [files, setFiles] = useState<FileWithPreview[]>([]);

    const { getRootProps, getInputProps } = useDropzone({
        accept: {
            'image/*': []
        },
        onDrop: (acceptedFiles: File[]) => {
            const mappedFiles = acceptedFiles.map(file =>
                Object.assign(file, {
                    preview: URL.createObjectURL(file)
                })
            );
            setFiles(mappedFiles);
        }
    });

    const thumbs = files.map(file => (
        <div style={thumb} key={file.name}>
            <div style={thumbInner}>
                <img
                    src={file.preview}
                    style={img}
                    alt={file.name}
                    onLoad={() => URL.revokeObjectURL(file.preview)}
                />
            </div>
        </div>
    ));

    useEffect(() => {
        return () => {
            files.forEach(file => URL.revokeObjectURL(file.preview));
        };
    }, [files]);

    return (
        <section className="container bg-blue-100 rounded-lg border-blue-200 shadow-lg ">
            <div {...getRootProps({ className: 'dropzone' })}>
                <input {...getInputProps()} />
                <p className=''>
                    <div className=''>
                        <Button > Select Image</Button>
                        </div> </p>
            </div>
            <aside style={thumbsContainer} className=''>
                {thumbs}
            </aside>
        </section>
    );
};

export default UploadImage;




// <Previews />