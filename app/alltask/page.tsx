"use client";

import Image from "next/image";
import task from "./../../assets/images/task.png";
import Link from "next/link";
import { useEffect } from "react";
import { useState } from "react";
import { supabase } from "@/lib/supabestClient";
import Footer from "@/components/Footer";

//สรเางประเภทข้อมูลแบบ Task
type Task = {
  id: string;
  created_at: string;
  title: string;
  detail: string;
  image_url: string;
  is_completed: boolean;
  update_at: string;
};
export default function Page() {
  //สร้างตัวแปร state สำหรับเก็บข้อมูลรายการงานทั้งหมด
  const [tasks, setTasks] = useState<Task[]>([]);

  useEffect(() => {
    //ดึงข้อมูลรายการงานทั้งหมดจาก Supabase
    const fetchTasks = async () => {
      //ดึงข้อมูลจากตาราง task_tb
      const { data, error } = await supabase
        .from("task_tb")
        .select(
          "id, created_at, title, detail, image_url, is_completed, update_at"
        ) //หรือ .select('*') ก็ได้
        .order("created_at", { ascending: false }); //เรียงลำดับจากใหม่ไปเก่า
      //ตรวจสอบข้อผิดพลาด
      if (error) {
        alert("เกิดข้อผิดพลาดในการดึงข้อมูล กรุณาลองใหม่อีกครั้ง");
        console.log(error.message);
        return;
      }

      if (data) {
        setTasks(data as Task[]);
      }
    };

    fetchTasks();
  }, []);

  const handleDeleteClick = async (id: string) => {
    if (confirm("คุณต้องการลบข้อมูลใช่หรือไม่")) {
      //ลบข้อมูลใน supabase ต่าม id ที่ส่งเข้ามา
      const { data, error } = await supabase
        .from("task_tb")
        .delete()
        .eq("id", id);

      if (error) {
        alert("เกิดข้อผิดพลาดในการลบข้อมูล กรุณาลองใหม่อีกครั้ง");
        console.log(error.message);
        return;
      }

      alert("ลบข้อมูลเรียบร้อย");
      //ลบข้อมูลใน state ออกด้วย
      setTasks(tasks.filter((task) => task.id !== id));
    }
  };
  return (
    <>
      <div className="flex flex-col items-center">
        <Image className="mt-20" src={task} alt="Task" width={120} />
        <h1 className="mt-10 text-2xl font-bold text-cyan-700">
          Manage Task App
        </h1>
        <h1 className="mt-5 text-lg text-cyan-700">บริการจัดการงานที่ทำ</h1>
        {/* ส่วนปุ่มเพิ่มงาน*/}
        <div className="flex justify-end w-10/12">
          <Link
            href="/addtask"
            className="mt-5 text-white bg-cyan-500 px-8 py-2 rounded hover:bg-cyan-700"
          >
            เพิ่มงาน
          </Link>
        </div>

        {/* ส่วนแสดงรายการงานทั้งหมด */}
        <div className="w-10/12 flex mt-5">
          <table className="w-full border">
            {/*หัวตาราง */}
            <thead>
              <tr className="text-center border font-bold bg-gray-300">
                <td className="border p-2">รูป</td>
                <td className="border p-2">งานที่ต้องการ</td>
                <td className="border p-2">รายละเอียดงาน</td>
                <td className="border p-2">สถานะ</td>
                <td className="border p-2">วันที่เพิ่ม</td>
                <td className="border p-2">วันที่แก้ไข</td>
                <td className="border p-2">ACTION</td>
              </tr>
            </thead>

            {/*เนื้อหาในตาราง */}
            <tbody>
              {/*วนลูปอาข้อมูลที่อยู่ในตัวแปร tasks มาแสดง */}
              {tasks.map((task) => (
                <tr key={task.id}>
                  <td className="border p-2">
                    {task.image_url ? (
                      <Image
                        className="mx-auto"
                        src={task.image_url}
                        alt={task.title}
                        width={50}
                        height={50}
                      />
                    ) : (
                      "."
                    )}
                  </td>
                  <td className="border p-2">{task.title}</td>
                  <td className="border p-2">{task.detail}</td>
                  <td className="border p-2">
                    {task.is_completed == true ? "✅สำเร็จ" : "❌ไม่สำเร็จ"}
                  </td>
                  <td className="border p-2">
                    {new Date(task.created_at).toISOString()}
                  </td>
                  <td className="border p-2 text-center">
                    {new Date(task.update_at).toISOString()}
                  </td>
                  <td className="border p-2 text-center">
                    <Link className="text-green-500 mr-5" href="#">
                      แก้ไข
                    </Link>
                    <button
                      onClick={() => handleDeleteClick(task.id)}
                      className="text-red-500 cursor-pointer hover:text-red-700"
                    >
                      ลบ
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <Footer />
      </div>
    </>
  );
}
