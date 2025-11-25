"use client";

import { createContext, useContext, useState } from "react";

const ModalContext = createContext();

export const ModalProvider = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [view, setView] = useState("login"); // Thêm biến 'view' để nhớ chế độ

  // Hàm mở modal nhận thêm tham số 'initialView' (mặc định là login)
  const openModal = (initialView = "login") => {
    setView(initialView);
    setIsOpen(true);
  };

  const closeModal = () => setIsOpen(false);

  return (
    // Truyền biến 'view' xuống dưới
    <ModalContext.Provider value={{ isOpen, openModal, closeModal, view }}>
      {children}
    </ModalContext.Provider>
  );
};

export const useModal = () => useContext(ModalContext);