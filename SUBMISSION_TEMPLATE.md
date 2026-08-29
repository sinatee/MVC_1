# SUBMISSION - Exit Exam MVC 1/2569 (เสาร์บ่าย)

## 1. วิธีเปิดโปรแกรม
- ภาษา/เฟรมเวิร์ก: Express.js, ejs
- Entry point / คำสั่งเปิดโปรแกรม: 
- หมายเหตุที่จำเป็น (ถ้ามี): 

## 2. ตารางเชื่อมโยง Requirements

| Requirement | Model / Domain | Controller / Action | View / Screen |
|---|---|---|---|
| R1  | member | MembersController | Memberlist |
| R2 | member, role_change_requests | RequestController | MembersView |
| R3| member, role_change_requests, decisions | RequestController | RequestView |
| R4 | member, role_change_requests, decisions | RequestController | RequestView |
| R5 | member, role_change_requests, decisions | RequestController | RequestView |

## 3. ผลการทดสอบ

| กรณี | ผ่าน/ไม่ผ่าน | หมายเหตุ (เฉพาะที่จำเป็น) |
|---|---|---|
| T1 | ผ่าน | |
| T2 | ผ่าน | |
| T3 | ผ่าน | |
| T4 | ผ่าน | |
| T5 | ไม่ผ่าน | ไม่ได้สร้าง attribute status ใน databsae |
| T6 | ผ่าน | |

## 4. ความแตกต่างระหว่างแบบที่ออกกับโปรแกรมจริง (ถ้ามี)
ระบุไม่เกิน 3 ข้อ
1. 
2. 
3. 

## 5. บันทึกการใช้ Generative AI
หากไม่ได้ใช้ ให้ระบุ **ไม่ได้ใช้ Generative AI**

| เวลาโดยประมาณ | เครื่องมือ | ใช้เพื่ออะไร | นำคำแนะนำไปใช้อย่างไร |
|---|---|---|---|
| 2.24pm | mermaid | ถาม syntax mermaid ในการ map ตารางเชื่อมโยง Requirements เป็น class diagram | เอาไปวาดเป็น class diagram ใน mermaid|
| 3.02pm | express |  ถามว่า express parse json ยังไง | เอาไป parse เข้า database |
| 3.15 | express | ให้ เขียน script สำหรับ ข้อมูล mock จาก json | เอาข้อมูลเข้า databse |
