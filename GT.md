# Giới thiệu mã nguồn

## Ứng dụng có những gì?

**Một ngày thật tốt** là ứng dụng danh sách việc cần làm chạy trực tiếp trong trình duyệt. Giao diện gồm lời chào, đồng hồ Việt Nam, thanh tìm kiếm và lịch sử ở sidebar, cùng khu vực quản lý công việc.

Các chức năng chính:

- Thêm công việc bằng nút **Thêm** hoặc phím Enter; yêu cầu nội dung không được để trống.
- Chọn mức ưu tiên **Quan trọng**, **Bình thường** hoặc **Thấp**. Mức Quan trọng có viền đỏ, mức Thấp có viền xanh.
- Đánh dấu hoặc bỏ đánh dấu hoàn thành bằng checkbox hay nhấn vào nội dung công việc.
- Nhấn đúp vào nội dung công việc để sửa tên và mức ưu tiên; chọn **Lưu** hoặc **Hủy**.
- Xóa công việc với hiệu ứng mờ dần 1500 ms.
- Tìm kiếm công việc theo từ khóa khi nhập.
- Chuyển đổi giao diện sáng/tối.
- Xem lịch sử thêm, sửa, hoàn thành, bỏ hoàn thành và xóa công việc.
- Lưu công việc, trạng thái, mức ưu tiên, lịch sử và giao diện vào LocalStorage để khôi phục sau khi tải lại trang.

## Các tệp trong dự án

### `index.html`

Tệp cấu trúc chính của trang, sử dụng HTML5. Tệp khai báo:

- Header, thương hiệu và nút chuyển giao diện.
- Sidebar có ô tìm kiếm và khu vực lịch sử.
- Phần lời chào cùng đồng hồ giờ Việt Nam.
- Form thêm công việc, ô chọn ưu tiên và danh sách `<ul>`.
- Footer hiển thị số lượng công việc.

Tệp này tải `styles.css` để định dạng giao diện và `app.js` để xử lý tương tác.

### `styles.css`

Chứa toàn bộ phần trình bày giao diện:

- Bố cục dashboard, sidebar, danh sách việc và khu vực lịch sử.
- Kiểu hiển thị cho các mức ưu tiên và trạng thái hoàn thành.
- Hiệu ứng xóa mờ dần, nút bấm, form và trạng thái focus.
- Giao diện sáng/tối thông qua thuộc tính `data-theme`.
- Quy tắc responsive cho màn hình nhỏ và hỗ trợ tùy chọn giảm chuyển động.

### `app.js`

Chứa logic chạy trên trình duyệt:

- Thêm, sửa, xóa và đánh dấu hoàn thành công việc.
- Cập nhật số lượng công việc và lọc danh sách theo nội dung tìm kiếm.
- Hiển thị đồng hồ, ngày theo múi giờ `Asia/Ho_Chi_Minh`, cập nhật mỗi giây.
- Ghi và hiển thị lịch sử hoạt động; giới hạn 100 sự kiện gần nhất.
- Lưu/khôi phục danh sách công việc, lịch sử và giao diện sáng/tối bằng LocalStorage.
- Kiểm tra dữ liệu đã lưu trước khi dựng lại danh sách.

### `README.md`

Hướng dẫn mở ứng dụng và sử dụng các chức năng dành cho người dùng.

### `.vscode/`

Thư mục cấu hình tùy chọn dành cho Visual Studio Code. Ứng dụng vẫn có thể mở trực tiếp bằng trình duyệt thông qua `index.html`; không cần cấu hình chạy riêng trong thư mục này.

## Dữ liệu được lưu ở đâu?

Ứng dụng dùng LocalStorage của trình duyệt hiện tại. Dữ liệu không tự đồng bộ giữa các trình duyệt hoặc thiết bị. Xóa dữ liệu trang web trong trình duyệt có thể làm mất công việc, lịch sử và tùy chọn giao diện đã lưu.
