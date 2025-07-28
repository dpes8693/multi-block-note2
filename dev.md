# 開發文件

## 當前問題

缺點: 0. /scrollbar 點一下就消失無法拖曳 scrollbar

1. 無法在 heading 收合時拖曳 block 進去
2. heading 展開時還要點一下新增 block 才能拖曳 block 進去
3. codeBlock 沒有更改顏色判斷程式語言

<https://www.blocknotejs.org/docs/features/blocks/code-blocks>

```md
For syntax highlighting of code blocks, you must provide a `codeBlock.createHighlighter` function
```

4. alert 是客製化的
   可以複製但是沒有文字 並且無法輸入
   點 6 個點出現顏色=> 應該禁止
   移動時文字會消失 => 應該要有

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
Inline Content Types 是利用特殊文字ex: @呼叫自訂選單做自訂功能
Block Side Menu 是產生區塊後左邊的操作選單