# 開發文件

2025/07/29
update: 預覽 html
update: markdown 和 html 變更編輯器後即時更新
remove: codeBlock
update: darkMode
update: codeBlock 更改語言
update: 匯入匯出json


2025/07/28
update: .bn-suggestion-menu crollbar-color
fixed: alert 移動時文字會消失，可以複製但是沒有文字 並且無法輸入

## 當前問題

缺點:

1. 無法在 heading 收合時拖曳 block 進去
2. heading 展開時還要點一下新增 block 才能拖曳 block 進去
3. codeBlock 沒有更改顏色判斷程式語言

<https://www.blocknotejs.org/docs/features/blocks/code-blocks>

```md
For syntax highlighting of code blocks, you must provide a `codeBlock.createHighlighter` function
```

4. alert 是客製化的
   點 6 個點出現顏色=> 應該禁止

5. scrollbar 點一下就消失無法拖曳 scrollbar
6. drag 自動滾動整個螢幕判斷區域太小很難抓到
7. [bug]圖片建立後 左上角會多一個區塊蓋在文字上影響編輯
8. 無法透過 6 個點刪除空區塊

## How

- 怎麼隱藏/擴充選單?
  <https://www.blocknotejs.org/docs/react/components/suggestion-menus>

總計：17 種不同的 type

## Block Types (14 種)

```md
    paragraph - 段落
    heading - 標題
    quote - 引用
    toggleListItem - 可展開列表項目
    numberedListItem - 數字列表項目
    bulletListItem - 圓點列表項目
    checkListItem - 勾選列表項目
    codeBlock - 程式碼區塊
    table - 表格
    image - 圖片
    video - 影片
    audio - 音訊
    file - 檔案
    alert - 警告框
```

### Content Types (3 種)

```md
    text - 文字內容
    tableContent - 表格內容
    tableCell - 表格儲存格
```

## 未來擴充

[匯出](https://www.blocknotejs.org/docs/foundations/supported-formats#export-only)
[怎麼做多人在線共同編輯](https://www.blocknotejs.org/docs/features/collaboration)
page 嵌套

---

Formatting Toolbar 是框選文字浮現出的選單 ex:可以改文字粗體和顏色
Inline Content Types 是利用特殊文字 ex: @呼叫自訂選單做自訂功能
Block Side Menu 是產生區塊後左邊的操作選單

Aert:
<https://stackblitz.com/github/TypeCellOS/BlockNote/tree/main/examples/06-custom-schema/05-alert-block-full-ux?file=README.md>

```md
Alert2
原始問題： Alert 組件在刪除文字後無法編輯，拖拽後需要二次拖拽才能正確更新
根本原因：React API 的 createReactBlockSpec 在處理拖拽和重新渲染時存在穩定性問題
解決方案：改用 Vanilla JS API 的 createBlockSpec，直接操作 DOM
最終實現的特點：
✅ 拖拽穩定：不再需要二次拖拽就能正確更新
✅ 樣式一致：完全符合原始設計的 DOM 結構和 CSS 類名
✅ 功能完整：點擊圖標可以循環切換 alert 類型
✅ 編輯正常：文字內容區域始終可編輯
✅ 性能優化：使用 requestAnimationFrame 確保流暢更新

這個解決方案展示了有時候回到更基礎的 API（Vanilla JS）反而能解決複雜框架帶來的問題。BlockNote 的 Vanilla JS API 更穩定，特別是在處理拖拽等複雜交互時。

如果以後遇到類似的 BlockNote 組件問題，現在您知道可以考慮使用 createBlockSpec 而不是 createReactBlockSpec 來獲得更好的穩定性！
```

## 移除預設 block

<https://www.blocknotejs.org/examples/basic/removing-default-blocks>

## 上傳覆蓋

<https://www.blocknotejs.org/examples/backend/file-uploading>

## 載入本地&儲存本地

<https://www.blocknotejs.org/examples/backend/saving-loading>

## 預覽成果

<https://www.blocknotejs.org/examples/backend/rendering-static-documents>
