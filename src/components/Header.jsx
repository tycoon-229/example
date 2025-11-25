"use client";

import { useRouter } from "next/navigation";
import { ChevronLeft, ChevronRight, User, LogOut, LogIn, UserPlus, ShieldCheck, Settings } from "lucide-react"; 
import { supabase } from "@/lib/supabaseClient";
import { useEffect, useState, useRef, useCallback } from "react";
import { useModal } from "@/context/ModalContext";

const Header = ({ children, className }) => {
  const router = useRouter();
  const { openModal } = useModal(); 
  
  const [user, setUser] = useState(null);
  const [avatarUrl, setAvatarUrl] = useState(null); // State lưu ảnh avatar
  const [isAdmin, setIsAdmin] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const menuRef = useRef(null);

  // Hàm tải dữ liệu User (Được tách ra để có thể gọi lại khi cần)
  const getUserData = useCallback(async () => {
    const { data: { session } } = await supabase.auth.getSession();
    const currentUser = session?.user ?? null;
    setUser(currentUser);

    if (currentUser) {
      const { data: profile } = await supabase
        .from('profiles')
        .select('role, avatar_url') // <--- Lấy thêm avatar_url
        .eq('id', currentUser.id)
        .single();
      
      if (profile) {
        setIsAdmin(profile.role === 'admin');
        setAvatarUrl(profile.avatar_url); // <--- Lưu avatar vào state
      }
    } else {
      setIsAdmin(false);
      setAvatarUrl(null);
    }
  }, []);

  useEffect(() => {
    getUserData(); // Chạy lần đầu khi vào web
    
    // 1. Lắng nghe sự kiện đăng nhập/đăng xuất từ Supabase
    const { data: authListener } = supabase.auth.onAuthStateChange(() => {
        getUserData();
    });

    // 2. LẮNG NGHE SỰ KIỆN TỪ TRANG PROFILE ("profile-updated")
    const handleProfileUpdate = () => {
      getUserData(); // Tải lại dữ liệu ngay lập tức
    };
    window.addEventListener('profile-updated', handleProfileUpdate);

    // Xử lý click ra ngoài menu
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);

    // Dọn dẹp khi component bị hủy
    return () => {
      authListener.subscription.unsubscribe();
      window.removeEventListener('profile-updated', handleProfileUpdate); // Hủy lắng nghe
      document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [getUserData]);

  const handleLogout = async () => {
    setShowMenu(false);
    await supabase.auth.signOut();
    router.refresh();
    // window.location.reload(); // Không cần reload nữa vì onAuthStateChange đã xử lý
  }

  return (
    <div className={`h-fit bg-gradient-to-b from-emerald-800 p-6 ${className}`}>
      <div className="w-full mb-4 flex items-center justify-between">
        
        {/* Nút Back/Forward */}
        <div className="hidden md:flex gap-x-2 items-center">
          <button onClick={() => router.back()} className="rounded-full bg-black flex items-center justify-center p-2 hover:opacity-75 transition">
            <ChevronLeft size={24} className="text-white"/>
          </button>
          <button onClick={() => router.forward()} className="rounded-full bg-black flex items-center justify-center p-2 hover:opacity-75 transition">
            <ChevronRight size={24} className="text-white"/>
          </button>
        </div>

        {/* ICON USER / AVATAR */}
        <div className="flex items-center gap-x-4 relative" ref={menuRef}>
          
          <button 
            onClick={() => setShowMenu(!showMenu)} 
            className="bg-white p-[2px] rounded-full hover:opacity-75 transition shadow-md overflow-hidden h-10 w-10 flex items-center justify-center"
          >
            {/* Logic hiển thị ảnh: Có Url thì hiện ảnh, không thì hiện icon */}
            {user && avatarUrl ? (
               <img src={avatarUrl} alt="Avatar" className="object-cover w-full h-full rounded-full" />
            ) : (
               <User className="text-black p-1" size={30}/>
            )}
          </button>

          {/* MENU THẢ XUỐNG */}
          {showMenu && (
            <div className="absolute top-full right-0 mt-2 w-56 bg-neutral-800 border border-neutral-700 rounded-md shadow-xl z-50 overflow-hidden py-1">
              {user ? (
                <>
                  <div className="px-4 py-3 border-b border-neutral-700 mb-1">
                    <p className="text-sm text-white truncate font-semibold">Xin chào,</p>
                    <p className="text-xs text-neutral-400 truncate">{user.email}</p>
                  </div>
                  {isAdmin && (
                    <div 
                      onClick={() => { router.push('/admin'); setShowMenu(false); }}
                      className="px-4 py-2 text-sm text-emerald-400 hover:bg-neutral-700 cursor-pointer flex items-center gap-x-2"
                    >
                      <ShieldCheck size={16} />
                      Admin Dashboard
                    </div>
                  )}
                  <div 
                    onClick={() => { router.push('/account'); setShowMenu(false); }}
                    className="px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 cursor-pointer flex items-center gap-x-2"
                  >
                    <Settings size={16} />
                    Hồ sơ cá nhân
                  </div>
                  <div className="border-t border-neutral-700 my-1"></div>
                  <div 
                    onClick={handleLogout}
                    className="px-4 py-2 text-sm text-red-400 hover:bg-neutral-700 cursor-pointer flex items-center gap-x-2"
                  >
                    <LogOut size={16} />
                    Đăng xuất
                  </div>
                </>
              ) : (
                <>
                   <div className="px-4 py-3 border-b border-neutral-700 mb-1">
                    <p className="text-sm text-white font-semibold">Khách</p>
                  </div>
                  <div 
                    onClick={() => { openModal('login'); setShowMenu(false); }}
                    className="px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 cursor-pointer flex items-center gap-x-2"
                  >
                    <LogIn size={16} />
                    Đăng nhập
                  </div>
                  <div 
                    onClick={() => { openModal('register'); setShowMenu(false); }}
                    className="px-4 py-2 text-sm text-neutral-200 hover:bg-neutral-700 cursor-pointer flex items-center gap-x-2"
                  >
                    <UserPlus size={16} />
                    Đăng ký tài khoản
                  </div>
                </>
              )}
            </div>
          )}
        </div>
      </div>
      {children}
    </div>
  );
}

export default Header;