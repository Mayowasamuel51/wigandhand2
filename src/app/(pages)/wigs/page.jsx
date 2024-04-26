"use client"
import { useState, useEffect } from "react";
import wig_one from "../../images/wig1.png"
import wig_two from "../../images/wig2.png"
import wig_three from "../../images/wig3.png"
import wig_four from "../../images/wig4.png"
import wig_five from "../../images/wig5.png"
import wig_six from "../../images/wig6.png"
import Image from 'next/image'
import { motion } from "framer-motion";
import { collection, getDocs, serverTimestamp } from "firebase/firestore"
import { db } from "@/firebase.config"
import { storage } from '@/firebase.config';
import { addDoc } from "firebase/firestore";
import { ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { v4 } from "uuid";
import { toast } from 'sonner';

const Page = () => {
  const [allWigs, setAllWigs] = useState([])
  const [imageFile, setImageFile] = useState("");
  const [perc, setPerc] = useState(null)
  const [data, setData] = useState({
    name: "",
    price: "",
    discount: "",
    image: undefined,
  })
  const handleInput = (e)=> {
    const {name , value, type, files} = e.target;
    setData(prev=> (
      {
        ...prev,
        [name] : type === "number" ? +value : value
      }
    ))
    console.log(data.image)
  }
  useEffect(()=> {
    const uploadImage = ()=> {
      const storageRef = ref(storage, `wigs/${imageFile.name + v4()}`)
      const uploadTask = uploadBytesResumable(storageRef, imageFile);
      uploadTask.on('state_changed', 
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log('Upload is ' + progress + '% done');
          setPerc(progress)
          toast.info(`Uploading ${Math.floor(progress)}%`);
          switch (snapshot.state) {
            case 'paused':
              console.log('Upload is paused');
              break;
            case 'running':
              console.log('Upload is running');
              break;
            default:
              break;
          }
        }, 
        (error) => {
          toast.error(error.message)
        }, 
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
            console.log('File available at', downloadURL);
            setData(prev=> ({...prev, image: downloadURL}))
          });
        }
      );
    }
    imageFile && uploadImage()
  }, [imageFile])

  const postWigs = async()=> {
    try {
      const response = await addDoc(collection(db,"wigs"), {...data, timeStamp: serverTimestamp()});
      console.log(response)
      toast.success("Successfully added!!")
      setData(prev=> ({
        ...prev,
        name: "",
        price: "",
        discount: "",
        image: undefined,
      }))
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(()=>{
    const fetchWigs = async()=>{
      let wigs = [];
      try {
        const querySnapshot = await getDocs(collection(db, "wigs"));
        querySnapshot.forEach((doc) => {
          // doc.data() is never undefined for query doc snapshots
          console.log(doc.id, " => ", doc.data());
          wigs.push({id: doc.id, ...doc.data()})
        });
        setAllWigs(wigs)
      }catch(error){
        console.log(error)
      }
    }
    fetchWigs();
  }, [])

  

  return (
    <div className="">
      <h1 className="my-2 text-center font-bold text-xl md:text-3xl text-[#7F6000]">Wigs</h1>
      <div className="flex flex-col gap-3 my-4">
        <div className="flex items-center gap-2">
          <Image src={imageFile ? URL?.createObjectURL(imageFile) : wig_one} width={100} height={100} alt="preview" className="w-24 aspect-square rounded-sm object-cover" />
          <input onChange={(e)=> setImageFile(e.target.files[0])} name="image" className="pl-5 h-8 md:h-10" type="file" placeholder="" />
        </div>
        <input onChange={handleInput} value={data.name} name="name" className="w-full pl-5 border-2 border-black h-9 md:h-10" type="text" placeholder="name" />
        <input onChange={handleInput} value={data.price} name="price" className="w-full pl-5 border-2 border-black h-9 md:h-10" type="number" placeholder="price" />
        <input onChange={handleInput} value={data.discount} name="discount" className="w-full pl-5 border-2 border-black h-9 md:h-10" type="number" placeholder="discount" />
        <motion.button onClick={()=> postWigs()} disabled={perc !== null && perc < 100} whileTap={{scale: 0.95}} className="bg-black text-white rounded-sm p-2 disabled:bg-red-600">UPLOAD</motion.button>
      </div>
      <section className="grid grid-cols-1 md:grid-cols-3 gap-10">
        {allWigs?.map((wig, index)=> (
          <div key={index} className="w-full aspect-square">
            <Image src={wig.image} width={1000} height={1000} alt={wig.name}/>
            <div className='py-2'>
              <h2 className='font-semibold'>{wig.name}</h2>
              <p className='font-bold'>${wig.price}.00</p>
            </div>
          </div>
        ))}
        <div className="w-full aspect-square">
          <Image placeholder='blur' src={wig_one} width={1000} height={1000} alt='wigs'/>
          <div className='py-2'>
            <h2 className='font-semibold'>The Kim K wig</h2>
            <p className='font-bold'>$750.00</p>
          </div>
        </div>
        <div className="w-full aspect-square">
          <Image placeholder='blur' src={wig_two} width={1000} height={1000} alt='wigs'/>
          <div className='py-2'>
            <h2 className='font-semibold'>The Audrey Wig</h2>
            <p className='font-bold'>$730.00</p>
          </div>
        </div>
        <div className="w-full aspect-square">
          <Image placeholder='blur' src={wig_three} width={1000} height={1000} alt='wigs'/>
          <div className='py-2'>
            <h2 className='font-semibold'>The Ava Wig</h2>
            <p className='font-bold'>$550.00</p>
          </div>
        </div>
        <div className="w-full aspect-square">
          <Image placeholder='blur' src={wig_four} width={1000} height={1000} alt='wigs'/>
          <div className='py-2'>
            <h2 className='font-semibold'>The Eva Wig</h2>
            <p className='font-bold'>$320.00</p>
          </div>
        </div>
        <div className="w-full aspect-square">
          <Image placeholder='blur' src={wig_five} width={1000} height={1000} alt='wigs'/>
          <div className='py-2'>
            <h2 className='font-semibold'>The Kelly Wig</h2>
            <p className='font-bold'>$120.00</p>
          </div>
        </div>
        <div className="w-full aspect-square">
          <Image placeholder='blur' src={wig_six} width={1000} height={1000} alt='wigs'/>
          <div className='py-2'>
            <h2 className='font-semibold'>The Khloe Wig</h2>
            <p className='font-bold'>$250.00</p>
          </div>
        </div>
      </section>
    </div>
  )
}

export default Page



