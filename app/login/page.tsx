import LongButton from '../../components/longButton';
import InputBox from '../../components/inputBox';


export default function LoginPage() {
 return (
   <div className="flex h-screen overflow-hidden">
     <div>
       <img src="/background.png" alt="Login Background" className="object-cover w-[476px] h-[832px]" />
     </div>


     <div className="flex-1 flex items-center justify-center">
       <div className="w-[452px] h-[565px] flex flex-col text-black space-y-4">
         <img src="login-header.png" alt="Login Header" className="w-[388px] h-[107px]" />
         <h1 className="font-bold text-[24px] font-family-raleway mt-10">Welcome Back!</h1>


         <div className="font-family-opensans flex flex-col items-center space-y-3">
           <div>
             <p className="text-[16px] mb-1">Email</p>
             <InputBox />
           </div>


           <div>
             <p className="text-[16px] mb-1">Password</p>
             <InputBox />
           </div>
           <div className="w-[452px] flex justify-end">
             <p className="text-[16px] mb-9">Forgot Password?</p>
           </div>
           <LongButton name="Login" />
           <p className="text-[16px] text-center mt-2">Don&apos;t have an account? <span className="font-bold text-primary">Register</span></p>
         </div>
       </div>
     </div>
   </div>
 );
}