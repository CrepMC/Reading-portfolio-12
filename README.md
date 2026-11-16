# Reading-portfolio-12 · Between the Lines

Portfolio tiếng Anh cho Grade 12, lớp 12E4, năm học 2026–2027. Thiết kế lấy cảm hứng từ tạp chí văn học trong ảnh tham khảo: nền giấy kem, màu xanh rừng, tiêu đề serif và minh họa SVG được tạo riêng.

Mở [index.html](index.html) ở gốc để xem website. Có **19 file HTML hoàn chỉnh và 18 file `embed.txt`**. Trang chủ ở gốc dùng để mở trực tiếp và làm trang vào cho GitHub Pages. Thư mục `Home/` giữ cặp HTML và embed tương ứng với trang Home trên Google Sites.

## Sử dụng trên máy

1. Mở `index.html` ở gốc bằng trình duyệt, kể cả khi không có mạng.
2. Chọn học kỳ hoặc tìm theo tiêu đề, tác giả, chủ đề. Các bộ lọc kết hợp với nhau; tìm `tet` cũng tìm được `Tết`.
3. Trong từng bài, dùng mục lục để đến phần tóm tắt, phân tích, hoạt động, từ vựng, reflection viết sẵn và nguồn.

Nếu muốn xem bằng HTTP trong thư mục dự án:

```powershell
node tools/serve.mjs
```

Mở `http://127.0.0.1:4173/`. Dừng server bằng Ctrl+C.

## Đưa lên GitHub

Thư mục `website` là repository Git riêng. Khi sẵn sàng, mở terminal trong thư mục `website` và đẩy nhánh `main` lên remote `origin`.

```powershell
git push -u origin main
```

Remote đã được cấu hình cho [CrepMC/Reading-portfolio-12](https://github.com/CrepMC/Reading-portfolio-12). Để phục vụ trang bằng GitHub Pages, chọn nhánh `main` và thư mục gốc `/` làm nguồn xuất bản. Các liên kết dùng đường dẫn tương đối để hoạt động dưới đường dẫn của repository. File `.nojekyll` để GitHub Pages phục vụ trực tiếp bộ HTML tĩnh.

Bốn thư mục `assets/image`, `assets/favicon`, `assets/json` và `assets/file` được để trống. Git chỉ ghi nhận các thư mục này sau khi chúng có file. Nếu cần tái tạo cấu trúc sau khi clone, chạy lệnh sau từ thư mục gốc.

```powershell
New-Item -ItemType Directory -Force -Path assets/image, assets/favicon, assets/json, assets/file
```

## Dán vào Google Sites

Theo [hướng dẫn chính thức của Google Sites](https://support.google.com/sites/answer/90569?hl=en), có thể nhúng HTML/CSS/JavaScript qua **Insert → Embed → Embed code**, hoặc **Pages → Add → Full page embed → Embed code**. Sau khi thêm code, chọn **Next → Insert**, xem trước rồi Publish khi sẵn sàng.

1. Tạo các trang native `Home`, `First semester`, `Second semester`. Tạo các trang con `Book-*-1` hoặc `Book-*-2` theo bảng dưới.
2. Mở đúng `embed.txt` bằng trình soạn thảo văn bản, sao chép **toàn bộ nội dung thô**. Không thêm Markdown code fences.
3. Dán vào **Embed code** của trang tương ứng. Ưu tiên full-page embed cho bài dài; điều chỉnh chiều cao nếu dùng vùng nhúng thông thường.
4. Xem trước trên máy tính và điện thoại. Dùng menu native của Google Sites để chuyển bài; kiểm tra quyền xem của giáo viên/lớp trước khi Publish.

**Liên kết giữa các trang trong embed cố ý là chữ không bấm được**, vì chưa có URL Google Sites đã xuất bản. Mục lục trong trang và các hoạt động vẫn dùng được. Trong `index.html`, các liên kết giữa trang là đường dẫn tương đối hoạt động bình thường. Không có iframe trỏ đến file cục bộ hoặc URL tự bịa.

Bản này **chưa được đăng hoặc thử trên Google Sites thực tế**. Đã kiểm tra fragment trong iframe `sandbox="allow-scripts"` có origin riêng và không truy cập được host. Mô phỏng này không xác nhận mọi giới hạn chiều cao, kích thước code hoặc hành vi của Google Sites. Nếu Sites từ chối fragment, giữ nguyên bản HTML và kiểm tra thông báo cụ thể trước khi đổi cách triển khai. Không có tự động đồng bộ sang Sites.

## Bảng ánh xạ đầy đủ

Mỗi thư mục dưới đây có đúng hai file: **`index.html`** để mở độc lập và **`embed.txt`** để dán vào Google Sites.

| Trang Google Sites         | Thư mục                     | Nội dung                                                              |
| -------------------------- | --------------------------- | --------------------------------------------------------------------- |
| Home                       | `Home/`                     | Bìa, hai bộ sưu tập, tìm kiếm và bộ lọc toàn bộ 15 bài                |
| First semester             | `First semester/`           | 8 bài, tìm kiếm và so sánh liên văn bản                               |
| First semester → Book-1-1  | `First semester/Book-1-1/`  | Playing Teen Sports May Protect From Some Damages of Childhood Trauma |
| First semester → Book-2-1  | `First semester/Book-2-1/`  | The Pros and Cons of Youth Sports Aren't Only Physical                |
| First semester → Book-3-1  | `First semester/Book-3-1/`  | Training the Goat                                                     |
| First semester → Book-4-1  | `First semester/Book-4-1/`  | Screen Addiction Among Teens: Is There Such A Thing?                  |
| First semester → Book-5-1  | `First semester/Book-5-1/`  | How TikTok Changed Our Musical World                                  |
| First semester → Book-6-1  | `First semester/Book-6-1/`  | Age Limits on Your Favorite Apps?                                     |
| First semester → Book-7-1  | `First semester/Book-7-1/`  | Genetically Modified Salmon: Food or 'Frankenfish'?                   |
| First semester → Book-8-1  | `First semester/Book-8-1/`  | Food Deserts                                                          |
| Second semester            | `Second semester/`          | 7 bài, tìm kiếm và so sánh liên văn bản                               |
| Second semester → Book-1-2 | `Second semester/Book-1-2/` | Want Out of Jail? First You Have to Take a Fast Food Job              |
| Second semester → Book-2-2 | `Second semester/Book-2-2/` | Electric scooters on collision course with pedestrians and lawmakers  |
| Second semester → Book-3-2 | `Second semester/Book-3-2/` | Crowd                                                                 |
| Second semester → Book-4-2 | `Second semester/Book-4-2/` | Excerpt from "Roughing It": Lost in the Snow                          |
| Second semester → Book-5-2 | `Second semester/Book-5-2/` | Why there's no place like home for the holidays                       |
| Second semester → Book-6-2 | `Second semester/Book-6-2/` | Making Up Thanksgiving as She Went Along                              |
| Second semester → Book-7-2 | `Second semester/Book-7-2/` | Tết: Celebrating the New Year                                         |

## Hoạt động riêng cho từng bài

| Bài      | Hoạt động                                                                             |
| -------- | ------------------------------------------------------------------------------------- |
| Book-1-1 | Timeline nghiên cứu, biểu đồ tỷ lệ tham gia 1:2, giải thích giới hạn quan hệ nhân quả |
| Book-2-1 | Phân loại lợi ích thể chất, rủi ro thể chất, chủ đề tâm lý chưa có bằng chứng         |
| Book-3-1 | Phân loại nhiệm vụ trainer trên sân và ngoài sân                                      |
| Book-4-1 | Ba tình huống giả định về bối cảnh và ảnh hưởng của việc dùng màn hình                |
| Book-5-1 | Hai quy trình tìm nghệ sĩ và ba góc nhìn về cơ hội/áp lực                             |
| Book-6-1 | Ma trận lợi ích và câu hỏi phản biện cho bốn lựa chọn chính sách                      |
| Book-7-1 | So sánh 18/36 tháng, bốn hướng tranh luận và mốc 2014/2015                            |
| Book-8-1 | Chọn bối cảnh đô thị/nông thôn và rào cản để tìm giải pháp tương ứng                  |
| Book-1-2 | Timeline vụ Husband và biểu đồ tổng thu nhập 25%/75% có giới hạn diễn giải            |
| Book-2-2 | So sánh tốc độ và lựa chọn không gian di chuyển                                       |
| Book-3-2 | Bốn chặng trong hành trình của Alex và phản ứng tương ứng                             |
| Book-4-2 | Sơ đồ vòng lặp minh họa và sắp xếp sự kiện bằng lựa chọn bàn phím                     |
| Book-5-2 | Biểu đồ tương tác bốn nhóm câu trả lời Pew 2008                                       |
| Book-6-2 | Keep/change/create và phần mở để tìm bước chuyển cảm xúc của chiếc bánh               |
| Book-7-2 | Timeline chuẩn bị/đón năm mới/ăn mừng và ý nghĩa các biểu tượng theo bài              |

Mỗi bài có 4 mục từ vựng mở bằng click hoặc bàn phím và một đoạn reflection tiếng Anh trong mục **My response**.

## Ghi chú về bộ bài đọc

- **Book-2-1 và Book-3-1:** chỉ có phần mở đầu và ghi chú từ vựng trong tài liệu cung cấp. Hai trang mang nhãn **Excerpt — incomplete source**. Muốn phân tích toàn bài cần bổ sung phần thân bài; không suy ra nội dung thiếu từ glossary.
- **Phân học kỳ:** tạm chia 8/7 theo thứ tự nguồn, chưa phải lịch phân công chính thức.
- **Google Sites:** cần tạo trang, dán fragment, xem trước và xuất bản bằng tài khoản của bạn.

## Nguồn, dữ liệu và quyền riêng tư

Tóm tắt và phân tích được viết lại từ 15 văn bản đã cung cấp. Từng trang ghi tác giả, năm, nhà xuất bản và những hạn chế về quyền sử dụng. Minh họa SVG nằm trong HTML để các trang mở được khi chỉ có bộ file của website.

Các tuyên bố về chẩn đoán, luật và chính sách nằm trong bối cảnh ngày xuất bản của nguồn. Số liệu được ghi rõ phạm vi và người đưa ra; biểu đồ không tạo thêm tỷ lệ. Tết được trình bày như mô tả của tác giả năm 2012, không khái quát cho mọi gia đình hay lặp lại các chi tiết món ăn/truyền thuyết gây tranh luận như sự thật đã kiểm chứng.

Footer dùng chung có thông tin liên hệ, ghi chú về quyền tác giả, lối vào trang cá nhân và nút **Follow on GitHub** để theo dõi CrepMC.

## Chỉnh sửa và tạo lại

Không chỉnh riêng `index.html` và `embed.txt`: chúng được sinh từ cùng một nguồn để giữ nội dung đồng nhất.

- Sửa nội dung bài đọc và reflection trong `tools/readings.mjs`. Hoạt động theo bài nằm trong `tools/labs.mjs`.
- Sửa đầu trang trong `components/header.mjs` và chân trang trong `components/footer.mjs`. `components/layout.mjs` ghép chúng vào mỗi trang.
- Danh mục dùng `components/library.mjs`. Các trang bài đọc dùng `components/reading-page.mjs`.
- Giao diện và hành vi dùng chung nằm trong `components/theme.css` và `components/runtime.js`.
- Chạy `tools/build.mjs` để tạo lại 19 file HTML và 18 fragment.

```powershell
node tools/build.mjs
```

Build dùng Node.js, nhưng các trang kết quả không cần Node, package, font mạng, file CSS/JS rời hoặc kết nối internet.

## Kiểm thử đã thực hiện

Chạy ngày **16/11/2026**, bằng Chromium từ Google Chrome cài trên máy. Kết quả chi tiết: `tools/test-results.json` và `tools/accessibility-results.json`.

- Đã kiểm tra cú pháp, liên kết và nội dung của 18 cặp HTML/embed. Trang chủ ở gốc mở được khi offline, tìm được bài và chuyển trang qua đường dẫn dự án `/Reading-portfolio-12/` trên máy.
- **57 lượt kiểm tra bố cục** cho 19 trang ở chiều rộng 1440, 768 và 360px. Không phát hiện tràn ngang, lỗi JavaScript hoặc yêu cầu tải asset bên ngoài.
- Kiểm tra tìm kiếm/bộ lọc kết hợp, kết quả rỗng, tìm Tết không dấu và hai trang học kỳ.
- Kiểm tra 15 reflection, liên kết ở footer, các bộ từ vựng và các hoạt động tương tác của từng bài.
- Mở đủ 18 trang bằng `file://`; kiểm tra chuyển trang qua đường dẫn chứa khoảng trắng.
- Nhúng cả 18 fragment vào iframe sandbox để kiểm tra reflection, footer và trạng thái của trang chứa iframe.
- Khi tắt JavaScript, tóm tắt, reflection, giải thích và thẻ từ vựng vẫn đọc được.
- Kiểm tra điểm vào bằng bàn phím, skip link và reduced motion. Đã xem ảnh chụp desktop/tablet/mobile và trang đọc/hoạt động đại diện.
- Quét axe theo WCAG 2.0/2.1 A/AA trên cả 19 trang, với **0 vi phạm tự động được báo**. Một số mục SVG và trang danh mục cần đánh giá thủ công.

**Chưa thực hiện:** Google Sites thực tế, Safari/Firefox, trình đọc màn hình hoặc thiết bị di động vật lý. Kết quả responsive đến từ viewport trình duyệt.

Để chạy lại kiểm thử (chỉ tooling cần các gói này):

```powershell
npm install --prefix tools/.qa --no-audit --no-fund playwright-core parse5 axe-core
node tools/serve.mjs
# Trong terminal khác, tại thư mục portfolio:
node tools/verify.mjs
node tools/accessibility.mjs
```

Mặc định test dùng Chrome tại `C:/Program Files/Google/Chrome/Application/chrome.exe`; đặt biến `RP_BROWSER` nếu trình duyệt ở vị trí khác. Có thể truyền đường dẫn `node_modules` làm đối số đầu tiên để dùng bộ công cụ đã cài nơi khác.
