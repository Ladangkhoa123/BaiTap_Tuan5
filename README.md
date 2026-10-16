# Hướng dẫn sử dụng — Một ngày thật tốt

Ứng dụng danh sách việc cần làm chạy trực tiếp trên trình duyệt, không cần cài đặt thêm.

## Mở ứng dụng

Mở tệp `index.html` bằng trình duyệt. Để trình duyệt tải ứng dụng ổn định, bạn cũng có thể mở thư mục dự án bằng VS Code và chạy `index.html` với tiện ích Live Server.

## Sử dụng

- **Thêm công việc:** nhập nội dung vào ô nhập, chọn mức ưu tiên rồi nhấn **Thêm** hoặc Enter. Nếu nội dung trống, ứng dụng sẽ yêu cầu nhập nội dung.
- **Chọn mức ưu tiên:** chọn **Quan trọng**, **Bình thường** hoặc **Thấp** trước khi thêm. Việc Quan trọng có viền đỏ; việc Thấp có viền xanh.
- **Đánh dấu hoàn thành:** nhấn checkbox hoặc nhấn vào nội dung công việc để bật/tắt trạng thái hoàn thành.
- **Sửa công việc:** nhấn đúp vào nội dung công việc để chỉnh nội dung và mức ưu tiên, sau đó chọn **Lưu** hoặc **Hủy**.
- **Xóa công việc:** nhấn **Xóa**. Công việc sẽ mờ dần rồi biến mất khỏi danh sách.
- **Tìm kiếm:** nhập từ khóa vào ô **Tìm kiếm bài viết...** ở sidebar. Danh sách được lọc ngay khi nhập; xóa từ khóa để hiện lại mọi công việc.
- **Xem lịch sử:** sidebar ghi lại các thao tác thêm, sửa, hoàn thành, bỏ hoàn thành và xóa; lịch sử giữ tối đa 100 hoạt động gần nhất.
- **Bật/tắt giao diện tối:** dùng công tắc ở góc trên bên phải. Lựa chọn được lưu lại sau khi tải lại trang.
- **Xem thời gian:** đồng hồ trong phần đầu trang hiển thị giờ Việt Nam và cập nhật mỗi giây.

## Lưu dữ liệu

Danh sách công việc, trạng thái hoàn thành, mức ưu tiên, lịch sử hoạt động và chế độ sáng/tối được lưu trong LocalStorage của trình duyệt. Khi tải lại trang, ứng dụng sẽ khôi phục dữ liệu đã lưu. Dữ liệu chỉ có trên trình duyệt và thiết bị hiện tại; xóa dữ liệu trang web của trình duyệt có thể xóa các công việc và lịch sử đã lưu.