import { useNavigate, Link } from "react-router-dom";
import { auth } from "@/firebase";
import { signInWithEmailAndPassword } from "firebase/auth";

const Login = () => {
  const navigate = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    

    signInWithEmailAndPassword(auth, email, password)
  .then((userCredential) => {
    const user = userCredential.user;
    localStorage.setItem("accessToken", JSON.stringify(user.uid))
    navigate("/")
    // ...
  })
  .catch((error) => {
    <div>{error}</div>
  });
  };
  return (
    <div className="flex justify-center items-center bg-blue-400 h-[100vh]">
      <div className=" bg-white rounded-2xl py-[20px] px-[50px] w-[400px]">
        <span className="block text-center text-[24px]">Lama Chat</span>
        <span className="block text-center text-[17px] mt-[10px] opacity-50">
          Login
        </span>
        <form
          className="flex flex-col gap-[15px] mt-[10px]"
          onSubmit={handleSubmit}
        >
          <input
            className="p-[5px] text-[14px] border-b-2 bg-white border-blue-400 hover:border-0 h-[40px]"
            type="email"
            placeholder="Email"
          />
          <input
            className="p-[5px] text-[14px] border-b-2 bg-white border-blue-400 hover:border-0 h-[40px]"
            type="password"
            placeholder="Password"
          />
          <button className="text-center bg-blue-400 text-white rounded-[10px] py-[7px] mt-[10px]">
            Sign in
          </button>
        </form>
        <p className="flex justify-center gap-[5px] text-[13px] mt-[10px]">
          You don't have an account?{" "}
          <Link className="text-blue-400 border-b-2" to="/register">
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
