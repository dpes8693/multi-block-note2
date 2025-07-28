import { defaultProps, createBlockSpec } from "@blocknote/core";
// 引入所需的圖標
import { MdCancel, MdCheckCircle, MdError, MdInfo } from "react-icons/md";
import { GoAlertFill } from "react-icons/go";

// The types of alerts that users can choose from.
export const alertTypes = [
  {
    title: "Default",
    value: "default",
    icon: MdInfo,
    color: "#9a9a9aff",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#ffe9c3ff",
    },
  },
  {
    title: "Warning",
    value: "warning",
    icon: GoAlertFill,
    color: "#e69819",
    backgroundColor: {
      light: "#fff6e6",
      dark: "#805d20",
    },
  },
  {
    title: "Error",
    value: "error",
    icon: MdCancel,
    color: "#d80d0d",
    backgroundColor: {
      light: "#ffe6e6",
      dark: "#802020",
    },
  },
  {
    title: "Info",
    value: "info",
    icon: MdError,
    color: "#507aff",
    backgroundColor: {
      light: "#e6ebff",
      dark: "#203380",
    },
  },
  {
    title: "Success",
    value: "success",
    icon: MdCheckCircle,
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
      const alertType = alertTypes.find((a) => a.value === block.props.type)!;
      
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
      const Icon = alertType.icon;
      const iconElement = document.createElement("div");
      iconElement.className = "alert-icon";
      iconElement.setAttribute("data-alert-icon-type", block.props.type);
      
      // 創建一個臨時的 React 元素來獲取 SVG
      const tempDiv = document.createElement("div");
      
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
        const currentIndex = alertTypes.findIndex(t => t.value === block.props.type);
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
  const iconSVGs: Record<string, string> = {
    default: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="default_svg__lucide default_svg__lucide-info">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="M12 16v-4M12 8h.01"></path>
    </svg>`,
    warning: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="warning_svg__lucide warning_svg__lucide-triangle-alert">
      <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3M12 9v4M12 17h.01"></path>
    </svg>`,
    error: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="error_svg__lucide error_svg__lucide-circle-x">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m15 9-6 6M9 9l6 6"></path>
    </svg>`,
    info: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" aria-label="Note">
      <path fill-rule="evenodd" clip-rule="evenodd" d="M7 1.3c3.14 0 5.7 2.56 5.7 5.7s-2.56 5.7-5.7 5.7A5.71 5.71 0 0 1 1.3 7c0-3.14 2.56-5.7 5.7-5.7ZM7 0C3.14 0 0 3.14 0 7s3.14 7 7 7 7-3.14 7-7-3.14-7-7-7Zm1 3H6v5h2V3Zm0 6H6v2h2V9Z"></path>
    </svg>`,
    success: `<svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="success_svg__lucide success_svg__lucide-circle-check">
      <circle cx="12" cy="12" r="10"></circle>
      <path d="m9 12 2 2 4-4"></path>
    </svg>`,
  };
  return iconSVGs[type] || iconSVGs.default;
}
