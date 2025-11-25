import Header from "@/components/Header";

const AdminDashboard = () => {
  return (
    <div className="bg-neutral-900 rounded-lg h-full w-full overflow-hidden overflow-y-auto">
      <Header>
        <div className="mb-2">
          <h1 className="text-white text-3xl font-semibold">
            Khu vực quản trị viên
          </h1>
        </div>
      </Header>
      <div className="p-6">
        <p className="text-white">Chức năng upload nhạc sẽ nằm ở đây...</p>
      </div>
    </div>
  );
}

export default AdminDashboard;