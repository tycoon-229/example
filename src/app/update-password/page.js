"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import Header from "@/components/Header";

const UpdatePassword = () => {
  const router = useRouter();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null);

  // Kiểm tra xem có phiên làm việc (session) chưa. 
  // Khi click link từ mail, Supabase tự động tạo session tạm thời.
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (!session) {
        router.push("/"); // Nếu không hợp lệ, đẩy về trang chủ
      }
    });
  }, [router]);

  const handleUpdate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    try {
      // API cập nhật mật khẩu mới
      const { error } = await supabase.auth.updateUser({ 
        password: password 
      });

      if (error) throw error;
      
      setMessage({ type: 'success', text: 'Đổi mật khẩu thành công! Đang về trang chủ...' });
      setTimeout(() => {
        router.push("/");
      }, 2000);
    } catch (error) {
      setMessage({ type: 'error', text: error.message });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header className="from-bg-neutral-900">
        <div className="mb-2 flex flex-col gap-y-6">
          <h1 className="text-white text-3xl font-semibold text-center mt-10">
            Đặt lại mật khẩu mới
          </h1>
        </div>
      </Header>
      
      <div className="flex justify-center items-center px-6">
        <form onSubmit={handleUpdate} className="flex flex-col gap-4 w-full max-w-md mt-10">
          {message && (
             <div className={`p-3 rounded text-sm text-center ${message.type === 'error' ? 'bg-red-500/20 text-red-500' : 'bg-green-500/20 text-green-500'}`}>
               {message.text}
             </div>
          )}
          
          <label className="text-neutral-400 text-sm">Nhập mật khẩu mới của bạn:</label>
          <input
            type="password"
            placeholder="Mật khẩu mới..."
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            disabled={loading}
            required
            className="bg-neutral-700 p-4 rounded-md text-white outline-none focus:ring-2 focus:ring-green-500"
          />
          <button 
            type="submit" 
            disabled={loading}
            className="bg-green-500 text-black font-bold py-3 rounded-full hover:opacity-80 transition mt-4"
          >
            {loading ? 'Đang cập nhật...' : 'Xác nhận đổi mật khẩu'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default UpdatePassword;