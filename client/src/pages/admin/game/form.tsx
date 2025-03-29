import {GameType} from "./../../../shared/types";
import {useState} from "react";
import { MdAddCircle } from "react-icons/md";
import { ImBin } from "react-icons/im";
import { MdOutlineSaveAlt } from "react-icons/md";
import { getGames } from './../../../shared/data.ts';
import { getStorage } from 'firebase/storage';

type Props = {
    game?: GameType | null;
}

const GameForm = ({game=null}: Props) => {
    const newGameId:number = (getGames().length)+1;
    const [formData, setFormData] = useState<GameType>({id: newGameId.toString(), name: "", socials: [], steam: "", released: false, media: ""});

    const [socialsObjects, setSocialsObjects] = useState([{ name: "", url: "" }]);

    function addSocials(){
        setSocialsObjects([...socialsObjects,{ name: "", url: "" }]);
    }

    const handleSelectChange = (selectedOption: string, index: number) => {
        let onChangeValue = [...socialsObjects];
        onChangeValue[index].name = selectedOption;
        setSocialsObjects(onChangeValue);
    };

    const handleUrlChange = (newUrl: string, index: number) => {
        let onChangeValue = [...socialsObjects];
        onChangeValue[index].url = newUrl;
        setSocialsObjects(onChangeValue);
    };

    const handleDeleteSocials = (index: number) => {
        const newArray = [...socialsObjects];
        newArray.splice(index, 1);
        setSocialsObjects(newArray);
    };

    const [file, setFile] = useState();

    const handleMediaChange = (e) => {
        // setFile(URL.createObjectURL(e.target.files[0]));
    };
    //
    // const [mediaUploadProgress, setVideoUploadProgress] = useState(null);
    // const [videoUploadError, setVideoUploadError] = useState(null);
    //
    const handleUpdloadMedia = async () => {
        try {
            if (!file) {
                setVideoUploadError('Please select an image or video');
                return;
            }
            setVideoUploadError(null);
            const storage = getStorage(app);
            const fileName = new Date().getTime() + '-' + file.name;
            const storageRef = ref(storage, fileName);
            const uploadTask = uploadBytesResumable(storageRef, file);
            uploadTask.on(
                'state_changed',
                (snapshot) => {
                    const progress =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    setVideoUploadProgress(progress.toFixed(0));
                },
                (error) => {
                    setVideoUploadError('Video upload failed');
                    setVideoUploadProgress(null);
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        setVideoUploadProgress(null);
                        setVideoUploadError(null);
                        setFormData({ ...formData, video: downloadURL });
                    });
                }
            );
        } catch (error) {
            setVideoUploadError('Video upload failed');
            setVideoUploadProgress(null);
            console.log(error);
        }
    };

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        console.log(formData)
    }

    return (
        <div>
            { !game ? (
                <div id="new-game-form" className="flex flex-col items-center justify-center min-h-[100dvh]">
                    <h1 className="text-4xl p-6"> New Game </h1>
                    <form className="w-3/4 mx-auto flex flex-col gap-6" onSubmit={handleSubmit}>
                        <div className="flex gap-4">
                            <input onChange={e => {setFormData({...formData, name: e.target.value})}} type="text" name="Title" id="title" className="block p-4 w-4/5 text-2xl rounded-sm bg-blue-100 placeholder:text-black focus:outline-2 focus:outline-blue-400" placeholder="Title" />
                            <span className="flex items-center gap-4">
                                <input type="checkbox" id="checkbox" />
                                <label htmlFor="checkbox"className="text-2xl">Released</label>
                            </span>
                        </div>
                        <input onChange={e => {setFormData({...formData, steam: e.target.value})}} type="text" name="Steam" id="steam" className="block p-4 w-full  text-2xl rounded-sm bg-blue-100 placeholder:text-black focus:outline-2 focus:outline-blue-400" placeholder="Steam URL" />
                        <h1 className="text-3xl flex gap-4 items-center">Socials <MdAddCircle onClick={addSocials} /></h1>
                        {socialsObjects.map((item, index) => (
                            <div className="flex gap-4 items-center justify-between">
                                <select name="socials-select" id="socials-select" className="block p-4 w-1/5 text-2xl rounded-sm  bg-blue-100 placeholder:text-black focus:outline-2 focus:outline-blue-400" defaultValue="Discord" value={item.name}
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
                        <input type="file" accept="image/*,video/*" onChange={handleMediaChange}/>
                        <button className="flex gap-4 bg-blue-100 justify-center items-center py-4 px-10 rounded-lg shadow mb-4"><MdOutlineSaveAlt /> Save</button>
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
