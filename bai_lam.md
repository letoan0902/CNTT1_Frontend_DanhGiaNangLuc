# BÀI LÀM – ĐÁNH GIÁ NĂNG LỰC FRONTEND (K24)

- **Mã đề:** 01
- **Họ tên:** Lê Phú Toàn
- **Lớp:** CNTT1
- **Link repository:** https://github.com/letoan0902/CNTT1_Frontend_DanhGiaNangLuc
- **Hệ điều hành (Windows/macOS):** Windows
- **Mã commit P2 đã nộp trước phút 90 (gõ `git log --oneline -1`):** bf37453
- **Phiên bản Node.js (gõ `node -v`):** v26.4.0

## 4.1. Giao diện danh sách sản phẩm

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin. Đánh dấu `[x]` vào các mục đã làm để tự kiểm tra.

- [x] 4.1.1. Bố cục trang
- [x] 4.1.2. Bảng sản phẩm
- [x] 4.1.3. Định dạng dữ liệu
- [x] 4.1.4. Hiển thị trên điện thoại

## 4.2. Thêm, sửa, xoá sản phẩm qua API

> Pha 1 – mức AI-0 (không dùng AI).

> Chấm trực tiếp trên mã nguồn thư mục officemart_admin.

- [x] 4.2.1. Tải danh sách
- [x] 4.2.2. Form thêm sản phẩm
- [x] 4.2.3. Gửi form
- [x] 4.2.4. Sửa sản phẩm
- [x] 4.2.5. Xoá sản phẩm

## 4.3. Tìm kiếm, lọc và phân trang

> Pha 2 – mức AI-2 (được dùng AI, ghi nhật ký ở Mục 4.3.5).

> Mục 4.3.1 đến 4.3.3 và ý c của Mục 4.3.4 chấm trực tiếp trên mã nguồn.

- [x] 4.3.1. Tìm kiếm và lọc
- [x] 4.3.2. Phân trang
- [x] 4.3.3. Đồng bộ URL

### 4.3.4. Phản biện mã do AI sinh

#### a) Thao tác làm danh sách hiển thị sai

Các bước thao tác:

```text
Chuẩn bị: tạm sửa src/pages/ProductListPage.jsx để lấy hook từ src/ai/useProductSearch_ai.js.
Chạy API ở chế độ chậm (node mock-api/server.js --mode cham, giống npm run api:cham, bật thêm
API_ADMIN=1 để xem log request) và npm run dev, mở http://localhost:5173/products.

1. Gõ "ban" vào ô tìm kiếm rồi dừng khoảng 1 giây (URL thành /products?q=ban, request q=ban
   được gửi và phải 2,5 giây sau API mới trả lời).
2. Khi request q=ban chưa trả về, xoá chữ "ban" và gõ "chuot" (URL thành /products?q=chuot).
3. Không thao tác gì thêm, xem danh sách sau khoảng 1 giây và xem lại sau khoảng 4 giây.
```

Kết quả hiển thị:

```text
- Khoảng 1 giây sau khi gõ "chuot": danh sách là 10 sản phẩm chuột (Chuột trackball T50 Pro
  MOU-0117, Chuột bluetooth Travel Pro MOU-0112, ...), số trang "1 / 3". Lúc này còn đúng.
- Khoảng 4 giây sau khi gõ "chuot": danh sách đã tự đổi thành 10 sản phẩm của từ khoá cũ "ban"
  (Bàn làm việc trẻ em Pro DSK-0119, Bàn phím văn phòng Basic Pro KEY-0116, Bàn làm việc khung
  sắt Pro DSK-0114, ...), số trang thành "1 / 5", trong khi ô tìm kiếm vẫn là "chuot" và URL vẫn
  là /products?q=chuot. Không có dòng nào là chuột.
- Log của API mock: chỉ có 2 request GET /api/products là q=ban rồi q=chuot (cách nhau khoảng
  1 giây), cả hai đều aborted=false (không request nào bị huỷ).
```

Kết quả đúng:

```text
Ô tìm kiếm và URL đang là "chuot" nên danh sách phải là 10 sản phẩm chuột của trang 1
(Chuột trackball T50 Pro MOU-0117, Chuột bluetooth Travel Pro MOU-0112, ...), số trang "1 / 3",
và giữ nguyên như vậy. Kết quả của từ khoá cũ "ban" không được phép hiện lên nữa.
```

#### b) Vì sao hook hiển thị sai

Mỗi lần tham số đổi, hook gửi một request mới nhưng không huỷ và cũng không bỏ qua request cũ (effect không có hàm dọn dẹp), nên request nào trả về cũng gọi `setData`, `setTotal`. Request "ban" gửi trước nhưng trả về sau (2,5 giây so với 0,1 giây của "chuot"), vì vậy kết quả cũ ghi đè lên kết quả mới: danh sách là của request trả về sau cùng chứ không phải của tham số mới nhất (race condition).

#### c) Hook đã sửa

> Chấm trực tiếp trên file src/hooks/useProductSearch.js và trang danh sách.

### 4.3.5. Nhật ký dùng AI (giữ – sửa – loại bỏ)

> Ghi ít nhất 2 lần dùng AI có ảnh hưởng đến mã nộp. Không dùng AI trong Pha 2 thì xoá bảng và ghi "Không sử dụng AI trong Pha 2".

| Lần | Câu lệnh chính gửi cho AI | Đoạn mã hoặc ý AI đưa ra (file) | Quyết định (giữ/sửa/loại bỏ) | Lý do | Bằng chứng kiểm chứng (chạy thử gì, kết quả) |
|---|---|---|---|---|---|
| 1 | Viết hook đã sửa `src/hooks/useProductSearch.js`, cùng ý tưởng với hook AI của đề: tham số đổi hoặc gỡ component thì huỷ request cũ bằng `AbortController`, bỏ qua lỗi huỷ bằng `axios.isCancel`, request bị huỷ không được đụng vào state (kể cả `finally` không được tắt `loading`), luôn gửi `limit=10`, lỗi lấy message của server, có hàm tải lại cho nút "Thử lại" và sau khi xoá. | `src/hooks/useProductSearch.js`: mỗi lần effect chạy tạo một `AbortController`, truyền `signal` cho `api.get`, hàm dọn dẹp gọi `controller.abort()`; `catch` bỏ qua khi `axios.isCancel(err)`; `finally` chỉ `setLoading(false)` khi `!controller.signal.aborted`; state `reloadCount` và hàm `reload`. | Giữ | Sửa đúng chỗ gây lỗi ở ý b: request cũ bị huỷ nên không thể ghi đè kết quả mới, và request bị huỷ không tắt `loading` của request mới. | Chạy API chế độ chậm, lặp lại đúng thao tác ở ý a (gõ "ban", khoảng 1 giây sau đổi thành "chuot", chờ 4 giây): danh sách vẫn là 10 sản phẩm chuột, "1 / 3". Network của trình duyệt: request `q=ban` có trạng thái `net::ERR_ABORTED`, `q=chuot` trả 200. Log API mock: khi đi qua proxy của `npm run dev` thì `q=ban` vẫn ghi `aborted=false` (thử bằng curl tự ngắt sau 0,5 giây: gọi qua cổng 5173 ghi `aborted=false`, gọi thẳng cổng 3001 ghi `aborted=true`, tức proxy của Vite không chuyển tiếp việc huỷ); chạy Vite bằng một script tạm có proxy chuyển tiếp việc ngắt kết nối (không nằm trong bài nộp) thì log ghi `q=ban aborted=true`, `q=chuot aborted=false`. Chế độ lỗi (`loi`): hiện "Lỗi máy chủ, vui lòng thử lại" và nút "Thử lại"; đổi API về chế độ thường rồi bấm "Thử lại" thì có dữ liệu. |
| 2 | Ô `search-input` giữ state riêng cho chữ đang gõ, ngừng gõ 400 ms mới ghi `q` lên URL (URL là nơi duy nhất giữ tham số của request), đồng bộ ngược từ URL về ô nhập khi bấm Back/Forward; hai effect không được ghi qua ghi lại lẫn nhau hay xoá chữ đang gõ; đổi từ khoá hoặc bộ lọc thì về trang 1. | `src/components/ProductFilters.jsx`: state `keyword` và 2 effect: (1) `q` đổi thì `setKeyword(q)`, trừ khi `keyword.trim()` đã bằng `q`; (2) `setTimeout` 400 ms gọi `onChange({ q, page: 1 })`, dọn dẹp bằng `clearTimeout`, phụ thuộc `[keyword, q, category, status]`. `src/pages/ProductListPage.jsx`: đọc tham số bằng `useSearchParams`, ghi bằng hàm `updateParams`. | Giữ | Chạy thử các tình huống gõ nhanh, gõ chậm, khoảng trắng, Back/Forward đều đúng nên không cần đổi. | Log API mock: gõ liền "ban" chỉ có 1 request `q=ban`, không có request `q=b` hay `q=ba`; giả lập gõ "ghe xoay" mỗi ký tự cách nhau 250 ms (tổng khoảng 1,9 giây) chỉ có 1 request `q=ghe xoay`; gõ 3 dấu cách thì không có request, URL không đổi; gõ "ban", dừng, gõ thêm dấu cách rồi "phim" thì ô nhập còn nguyên "ban phim", URL là `q=ban+phim`. Bấm Back 5 lần rồi Forward 5 lần qua các URL vừa tạo (đổi trang, danh mục, trạng thái, từ khoá), dừng lại xem ở 6 bước: ô tìm kiếm, hai ô lọc, số trang và danh sách đều khớp URL. Gõ dở rồi bấm Back ngay: ô nhập về theo URL, 1,5 giây sau URL không bị ghi lại. Gõ "ghe" rồi 150 ms sau chọn danh mục "Ghế văn phòng": URL cuối là `?q=ghe&category=chair`, không mất bộ lọc. |
| 3 | Làm ô `category-filter` (danh mục lấy từ API, thêm lựa chọn "Tất cả") và ô `status-filter` (Tất cả, Đang bán, Ngừng bán); đổi bộ lọc thì về trang 1. | `src/components/ProductFilters.jsx`: bản đầu AI đặt chữ của lựa chọn rỗng là "Tất cả danh mục" và "Tất cả trạng thái". | Sửa | Đề ghi lựa chọn tên là "Tất cả"; chữ khác đề có thể bị tính sai nếu chấm theo chữ hiển thị. Đổi cả hai thành "Tất cả" (value `""`), phân biệt hai ô bằng `aria-label`. | Đọc DOM trên trang đang chạy: `category-filter` có các lựa chọn `""`=Tất cả, `keyboard`=Bàn phím, `mouse`=Chuột, `monitor`=Màn hình, `desk`=Bàn làm việc, `chair`=Ghế văn phòng; `status-filter` có `""`=Tất cả, `active`=Đang bán, `inactive`=Ngừng bán. Đang ở trang 3, chọn "Chuột": URL thành `?category=mouse`, số trang "1 / 3", 10 dòng đều là Chuột; chọn thêm "Đang bán": URL `?category=mouse&status=active`, "1 / 2", mọi dòng đều "Đang bán". |

## Ghi chú (không tính điểm)

Các trường hợp biên đã xử lý (đã chạy thử trên trình duyệt, trừ chỗ ghi "theo mã"):

- Từ khoá chỉ có khoảng trắng: cắt khoảng trắng đầu và cuối (`trim`) trước khi so sánh và ghi lên URL. Gõ 3 dấu cách thì coi như không có từ khoá: không ghi `q`, không gọi API. Mở thẳng `?q=%20%20` cũng được coi là không có từ khoá. Chữ trong ô nhập thì giữ nguyên để không làm mất dấu cách đang gõ dở.
- `page` không hợp lệ (`page=-3`, `page=abc`, `page=1.5`): hàm `parsePage` chỉ nhận số nguyên từ 1 trở lên, còn lại coi là trang 1 (hiện "1 / 12", nút trước bị khoá).
- `page` lớn hơn trang cuối (`page=999`): tải xong, biết `total` thì chuyển về trang cuối bằng `setSearchParams(..., { replace: true })` để bấm Back không quay lại trang không tồn tại. Ví dụ `?category=mouse&page=999` thành `?category=mouse&page=3`, hiện "3 / 3". Theo mã, trong lúc chờ chuyển trang hiện "Đang tải..." chứ không hiện empty-state.
- Xoá sản phẩm duy nhất của trang cuối (thêm 1 sản phẩm để có trang 13 chỉ 1 dòng rồi xoá dòng đó): danh sách tải lại, tự về `?page=12`, hiện "12 / 12", có toast; bấm Back không quay lại trang 13.
- Không có kết quả (`?q=khongco&page=3`): về trang 1, hiện empty-state "Không tìm thấy sản phẩm phù hợp", số trang "1 / 1", hai nút đều bị khoá.
- `status` lạ trên URL (`status=abc`): coi như "Tất cả", không gửi lên API. `category` lạ (không có trong danh mục của API, ví dụ `category=xyz`): cũng coi như "Tất cả" sau khi tải xong danh mục. Mở `?status=abc&category=xyz` thì hai ô lọc đều là "Tất cả" và danh sách đủ "1 / 12". Theo mã, URL được ghi lại sạch ở lần đổi tham số kế tiếp.
- Tham số rỗng và `page=1` không ghi lên URL (trang 1 không lọc là `/products`).
- Vùng phân trang chưa hiện khi chưa tải xong lần nào (chưa biết `total`), để không hiện số trang sai như "2 / 1".
- Lưu ý khi kiểm tra việc huỷ request: chạy bằng `npm run dev` thì xem ở tab Network của trình duyệt (request cũ có trạng thái canceled, `net::ERR_ABORTED`). Log của API mock không thấy `aborted=true` vì proxy của Vite không chuyển tiếp việc huỷ request sang API.
