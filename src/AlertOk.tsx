import { defaultProps, createBlockSpec } from "@blocknote/core";
// 引入所需的圖標
import {
  BsFillExclamationCircleFill,
  BsFillCheckCircleFill,
  BsFillXCircleFill,
  BsFillInfoCircleFill,
  BsFillExclamationTriangleFill,
} from "react-icons/bs";

// The types of alerts that users can choose from.
export const alertTypes = [
  {
    title: "Default",
    value: "default",
    icon: BsFillInfoCircleFill,
    color: "#9a9a9aff",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#ffe9c3ff",
    },
  },
  {
    title: "Warning",
    value: "warning",
    icon: BsFillExclamationTriangleFill,
    color: "#e69819",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  {
    title: "Error",
    value: "error",
    icon: BsFillXCircleFill,
    color: "#d80d0d",
    backgroundColor: {
      light: "#ffe6e6",
      dark: "#802020",
    },
  },
  {
    title: "Info",
    value: "info",
    icon: BsFillExclamationCircleFill,
    color: "#507aff",
    backgroundColor: {
      light: "#e6ebff",
      dark: "#203380",
    },
  },
  {
    title: "Success",
    value: "success",
    icon: BsFillCheckCircleFill,
    color: "#0bc10b",
    backgroundColor: {
      light: "#e6ffe6",
      dark: "#208020",
    },
  },
] as const;

// The Alert block using Vanilla JS API for better stability
export const Alert = createBlockSpec(
  {
    type: "alert",
    propSchema: {
      textAlignment: defaultProps.textAlignment,
      textColor: defaultProps.textColor,
      type: {
        default: "warning",
        values: ["warning", "error", "info", "success", "default"],
      },
    },
    content: "inline",
  },
  {
    render: (block, editor) => {

      // 創建主容器
      const alertContainer = document.createElement("div");
      alertContainer.className = "alert";
      alertContainer.setAttribute("data-alert-type", block.props.type);

      // 創建圖標容器 - 保持與原來相同的結構
      const iconWrapper = document.createElement("div");
      iconWrapper.className = "alert-icon-wrapper";
      iconWrapper.contentEditable = "false";
      iconWrapper.setAttribute("aria-haspopup", "menu");
      iconWrapper.setAttribute("aria-expanded", "false");

      // 創建圖標元素 - 使用 React 圖標的 SVG
      const iconElement = document.createElement("div");
      iconElement.className = "alert-icon";
      iconElement.setAttribute("data-alert-icon-type", block.props.type);

      iconWrapper.appendChild(iconElement);

      // 創建內容容器 - 使用與原來相同的類名和屬性
      const contentContainer = document.createElement("div");
      contentContainer.className = "bn-inline-content inline-content";

      // 創建內部內容容器
      const innerContent = document.createElement("div");
      innerContent.setAttribute("data-node-view-content-react", "");
      innerContent.style.cssText = "white-space: inherit;";

      contentContainer.appendChild(innerContent);

      // 添加點擊事件來切換類型
      iconWrapper.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();

        // 簡單的類型切換邏輯
        const currentIndex = alertTypes.findIndex(
          (t) => t.value === block.props.type
        );
        const nextIndex = (currentIndex + 1) % alertTypes.length;
        const nextType = alertTypes[nextIndex].value;

        // 使用 requestAnimationFrame 來確保更流暢的更新
        requestAnimationFrame(() => {
          editor.updateBlock(block, {
            type: "alert",
            props: { type: nextType },
          });
        });
      });

      // 渲染圖標
      const renderIcon = () => {
        const svgString = getIconSVG(block.props.type);
        iconElement.innerHTML = svgString;
      };

      renderIcon();

      alertContainer.appendChild(iconWrapper);
      alertContainer.appendChild(contentContainer);

      return {
        dom: alertContainer,
        contentDOM: innerContent,
        // 添加 update 方法來處理屬性變化
        update: (newBlock) => {
          if (newBlock.type !== "alert") {
            return false;
          }

          // 更新屬性和圖標
          alertContainer.setAttribute("data-alert-type", newBlock.props.type);
          iconElement.setAttribute("data-alert-icon-type", newBlock.props.type);
          iconElement.innerHTML = getIconSVG(newBlock.props.type);

          return true;
        },
      };
    },
  }
);

// 輔助函數：獲取圖標的 SVG
function getIconSVG(type: string): string {
  // 從 alertTypes 中找到對應的圖標組件
  const alertType = alertTypes.find((a) => a.value === type);
  const IconComponent = alertType?.icon || BsFillInfoCircleFill;

  // 創建 SVG 元素並設置屬性
  const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
  svg.setAttribute("width", "16");
  svg.setAttribute("height", "16");
  svg.setAttribute("fill", "currentColor");
  svg.setAttribute("viewBox", "0 0 16 16");

  // 獲取 React Icon 的路徑數據 - 根據圖標組件映射到對應的路徑
  // 這裡我們需要手動提供每個圖標的路徑，因為我們無法直接渲染 React 組件
  const iconPaths: Record<string, string> = {
    [BsFillInfoCircleFill.name]:
      "M8 16A8 8 0 1 0 8 0a8 8 0 0 0 0 16zm.93-9.412-1 4.705c-.07.34.029.533.304.533.194 0 .487-.07.686-.246l-.088.416c-.287.346-.92.598-1.465.598-.703 0-1.002-.422-.808-1.319l.738-3.468c.064-.293.006-.399-.287-.47l-.451-.081.082-.381 2.29-.287zM8 5.5a1 1 0 1 1 0-2 1 1 0 0 1 0 2z", // BsFillInfoCircleFill
    [BsFillExclamationTriangleFill.name]:
      "M8.982 1.566a1.13 1.13 0 0 0-1.96 0L.165 13.233c-.457.778.091 1.767.98 1.767h13.713c.889 0 1.438-.99.98-1.767L8.982 1.566zM8 5c.535 0 .954.462.9.995l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 5.995A.905.905 0 0 1 8 5zm.002 6a1 1 0 1 1 0 2 1 1 0 0 1 0-2z", // BsFillExclamationTriangleFill
    [BsFillXCircleFill.name]:
      "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM5.354 4.646a.5.5 0 1 0-.708.708L7.293 8l-2.647 2.646a.5.5 0 0 0 .708.708L8 8.707l2.646 2.647a.5.5 0 0 0 .708-.708L8.707 8l2.647-2.646a.5.5 0 0 0-.708-.708L8 7.293 5.354 4.646z", // BsFillXCircleFill
    [BsFillExclamationCircleFill.name]: 
      "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zM8 4a.905.905 0 0 0-.9.995l.35 3.507a.552.552 0 0 0 1.1 0l.35-3.507A.905.905 0 0 0 8 4zm.002 6a1 1 0 1 0 0 2 1 1 0 0 0 0-2z", // BsFillExclamationCircleFill
    [BsFillCheckCircleFill.name]:
      "M16 8A8 8 0 1 1 0 8a8 8 0 0 1 16 0zm-3.97-3.03a.75.75 0 0 0-1.08.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.061L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-.01-1.05z", // BsFillCheckCircleFill
  };

  const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
  path.setAttribute("d", iconPaths[IconComponent.name] || iconPaths[BsFillInfoCircleFill.name]);

  svg.appendChild(path);

  return svg.outerHTML;
}
