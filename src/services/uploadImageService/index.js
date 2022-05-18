import {ref, uploadBytesResumable, getDownloadURL } from '@firebase/storage'
import { storageImage } from '../../firebase'

export const getImageURL =  (file) => {
    return new Promise(function (resolve, reject) {
        const fileName = new Date().getTime() + file.name
        const storageRef = ref(storageImage, fileName);
        const uploadTask = uploadBytesResumable(storageRef, file);

        uploadTask.on('state_changed',
            (snapshot) => {

            },
            (error) => {
                reject(error.message)
            },
            () => {
                try{
                    getDownloadURL(uploadTask.snapshot.ref).then(async(downloadURL) => {
                        resolve(downloadURL)
                    }) 
                }
                catch(error){
                    reject(error.message)
                }
            }
        );
    })
}