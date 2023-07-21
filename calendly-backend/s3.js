const S3 = require('aws-sdk/clients/s3')
const fs = require('fs')
require('dotenv').config()


const region = process.env.AWS_BUCKET_REGION
const bucketName = process.env.AWS_BUCKET_NAME
const accessKey = process.env.AWS_ACCESS_KEY
const secretAccessKey = process.env.AWS_SECRET_ACCESS_KEY

const s3 = new S3({
    region, 
    accessKey,
    secretAccessKey
})

function uploadFile(file){
    const fileStream = fs.createReadStream(file.path)

    const uploadParams = {
        Bucket :bucketName,
        Body: fileStream,
        Key: file.filename
    }
    return s3.upload(uploadParams).promise()
}
exports.uploadFile = uploadFile

function getFileStream(fileKey){
    const downloadParams = {
        Key: fileKey,
        Bucket: bucketName
    }
    return s3.getObject(downloadParams).createReadStream()
}
exports.getFileStream = getFileStream
