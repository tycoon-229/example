import Header from "@/components/Header";

export default function Home() {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      {/* Header chứa nút Đăng nhập/Đăng ký */}
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            Chào mừng trở lại
          </h1>
        </div>
      </Header>

      {/* Phần nội dung chính */}
      <div className="mt-2 mb-7 px-6">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-2xl font-semibold">
            Bài hát mới nhất
          </h1>
        </div>
        <div className="mt-4 text-neutral-400">
          Danh sách bài hát sẽ hiện ở đây...
        </div>
      </div>
    </div>
  );
}