import {GameType} from "./../../../shared/types";
import {ChangeEvent, useState} from "react";
import { MdAddCircle } from "react-icons/md";
import { ImBin } from "react-icons/im";
import { MdOutlineSaveAlt } from "react-icons/md";
//import { getGames } from './../../../shared/data.ts';
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { MdDriveFolderUpload } from "react-icons/md";
import {app} from "../../../firebase.ts";
import { CircularProgressbar } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import {useNavigate} from "react-router-dom";

type Props = {
    game?: GameType | null;
}

const GameForm = ({game=null}: Props) => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState<GameType>({id: "", name: "", socials: [], steam: "", released: false, media: "", isVideo: false});
    const [socialsObjects, setSocialsObjects] = useState([{ name: "discord", url: "" }]);

    function addSocials(){
        setSocialsObjects([...socialsObjects,{ name: "discord", url: "" }]);
    }

    const handleTitleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const newTitle = e.target.value;
        const newId = newTitle.split(' ').join('-').toLowerCase().replace(/[^a-zA-Z0-9-]/g, '-')+Math.random().toString(20).substr(2, 6);
        setFormData({...formData, name: newTitle, id: newId});
    };

    const handleSelectChange = (selectedOption: string, index: number) => {
        let onChangeValue = [...socialsObjects];
        onChangeValue[index].name = selectedOption;
        setSocialsObjects(onChangeValue);
        console.log(socialsObjects);
    };

    const handleUrlChange = (newUrl: string, index: number) => {
        let onChangeValue = [...socialsObjects];
        onChangeValue[index].url = newUrl;
        setSocialsObjects(onChangeValue);
        console.log(socialsObjects);
    };

    const handleDeleteSocials = (index: number) => {
        const newArray = [...socialsObjects];
        newArray.splice(index, 1);
        setSocialsObjects(newArray);
        console.log(socialsObjects);
    };

    const [file, setFile] = useState<File| null>(null);
    const [fileURL, setFileURL] = useState<string| null>(null);
    const [isVideo, setIsVideo] = useState<boolean>(false);

    const handleMediaChange = (e: ChangeEvent<HTMLInputElement>) => {
        if (e.target.files)
        {
            const newFile = e.target.files[0];
            setFile(newFile);
            setFileURL(URL.createObjectURL(newFile));
            setIsVideo(newFile.type.startsWith('video/'));
        }
    };
    console.log(file,fileURL,isVideo);

    const [mediaUploadProgress, setMediaUploadProgress] = useState<string | null>(null);
    const [mediaUploadError, setMediaUploadError] = useState<string | null>(null);

    const handleUpdloadMedia = async () => {
        try {
            if (!file) {
                setMediaUploadError('Please select an image or video');
                return;
            }
            setMediaUploadError(null);

            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);

            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setMediaUploadProgress(progress.toFixed(0));
                },
                (_error) => {
                    setMediaUploadError('Media upload failed (File must be less than 100MB)');
                    setMediaUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setMediaUploadProgress(null);
                        setMediaUploadError(null);
                        setFormData({ ...formData, media: downloadURL, isVideo: isVideo });
                    });
                }
            );
        } catch (error) {
            setMediaUploadError('Media upload failed');
            setMediaUploadProgress(null);
            console.log(error);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        setFormData({...formData,socials: socialsObjects})
        console.log(formData);
        try {
            const res = await fetch('api/game/create', {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(formData),
            });
            const data = await res.json();
            if (data.success === false){
                window.alert(data.message);
                return;
            }
            if (res.ok) {
                navigate('/admin?tab=Games');
            }
        } catch (e) {
            window.alert("Something went wrong");
        }
    };

    return (
        <div>
            { !game ? (
                <div id="new-game-form" className="flex flex-col items-center justify-center min-h-[100dvh]">
                    <h1 className="text-4xl p-6"> New Game </h1>
                    <form className="w-3/4 mx-auto flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex gap-4">
                            <input onChange={handleTitleChange} type="text" name="Title" id="title" className="block p-4 w-4/5 text-2xl rounded-sm bg-blue-100 placeholder:text-black focus:outline-2 focus:outline-blue-400" placeholder="Title" />
                            <span className="flex items-center gap-4">
                                <input type="checkbox" id="checkbox" />
                                <label htmlFor="checkbox"className="text-2xl">Released</label>
                            </span>
                        </div>
                        <input onChange={e => {setFormData({...formData, steam: e.target.value})}} type="text" name="Steam" id="steam" className="block p-4 w-full  text-2xl rounded-sm bg-blue-100 placeholder:text-black focus:outline-2 focus:outline-blue-400" placeholder="Steam URL" />
                        <h1 className="text-3xl flex gap-4 items-center">Socials <MdAddCircle onClick={addSocials} /></h1>
                        {socialsObjects.map((item, index) => (
                            <div className="flex gap-4 items-center justify-between">
                                <select name="socials-select" id="socials-select" className="block p-4 w-1/5 text-2xl rounded-sm  bg-blue-100 placeholder:text-black focus:outline-2 focus:outline-blue-400" defaultValue="discord" value={item.name}
                                        onChange={e => {handleSelectChange(e.target.value, index);
                                }}>
                                    <option value="discord">Discord</option>
                                    <option value="instagram">Instagram</option>
                                    <option value="x">X (former Twitter)</option>
                                </select>
                                <input onChange={e => {handleUrlChange(e.target.value, index)}} type="text" name="url" id="url" className="block p-4 w-4/5  text-2xl rounded-sm placeholder:text-black bg-blue-100 focus:outline-2 focus:outline-blue-400" placeholder="URL" />
                                <div ><ImBin size={25} onClick={() => handleDeleteSocials(index)}/></div>
                            </div>
                        )) }
                        <h1 className="text-3xl flex gap-4 items-center">Media</h1>
                        <div className="border-6 border-dashed py-10 border-blue-200">
                            <div className="flex justify-evenly items-center py-5">
                                <input type="file" accept="image/*,video/*" onChange={handleMediaChange}/>
                                {mediaUploadProgress ? (
                                    <CircularProgressbar value={Number(mediaUploadProgress)} text={`${mediaUploadProgress}%`} />
                                    ) : (
                                        <div className="flex flex-col items-center justify-center">
                                            <button className="flex gap-4 bg-blue-100 justify-center items-center py-4 px-10 rounded-lg shadow" onClick={handleUpdloadMedia}><MdDriveFolderUpload size={25}/> Upload Media</button>
                                            {mediaUploadError && (
                                                <p className="py-2 text-red-500">{mediaUploadError}</p>
                                            )}
                                        </div>
                                )}

                            </div>

                            {fileURL && !isVideo && (
                                <div className="w-11/12 mx-auto flex justify-center">
                                    <img src={fileURL}/>
                                </div>)}

                            {fileURL && isVideo && (
                                <div className="w-11/12 mx-auto flex justify-center">
                                    <video src={fileURL} autoPlay muted controls/>
                                </div>)}
                        </div>

                        <button className="flex gap-4 bg-blue-100 justify-center items-center py-4 px-10 rounded-lg shadow mb-4"><MdOutlineSaveAlt size={25}/> Save</button>
                    </form>
                </div>
            ) : (
                <div>
                </div>
            )}
        </div>
    )
}
export default GameForm
