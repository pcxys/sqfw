let allWorkers = [];

// 1. 获取数据
document.addEventListener("DOMContentLoaded", () => {
  fetch("./data.json")
    .then((res) => {
      if (!res.ok) throw new Error("无法加载数据文件");
      return res.json();
    })
    .then((data) => {
      allWorkers = data;
      render(allWorkers);
    })
    .catch((err) => console.error("错误:", err));
});

// 2. 渲染函数
function render(data) {
    const container = document.getElementById('cardContainer');
    if (!container) return;

    container.innerHTML = data.map(item => {
        const displaySkills = item.category ? item.category.replace(/,/g, ' ') : '';

        return `
            <div class="col">
                <div class="card border-0 shadow-sm h-100 p-2">
                    <!-- 右上角推荐标签 -->
                    ${item.is_top === true ? '<div class="recommend-badge">推荐</div>' : ''}

                    <div class="d-flex align-items-start">
                        <img src="photo/${item.photo}" class="card-img-left me-3" alt="头像">
                        
                        <div class="flex-grow-1">
                            <!-- 姓名 + 动态备案标签 -->
                            <div class="d-flex align-items-center mb-1" style="padding-right: 35px;">
                                <h5 class="mb-0 fw-bold me-2">${item.name}</h5>
                                
                                <!-- 【关键修改】：仅在 true 时显示标签，false 时不显示 -->
                                ${item.is_verified === true ? 
                                    '<span class="badge bg-success-subtle text-success border" style="font-size:0.6rem">已公安备案</span>' 
                                    : '' 
                                }
                            </div>

                            <p class="text-primary mb-2 small fw-bold" style="min-height: 20px;">${displaySkills}</p>
                            
                            <a href="tel:${item.phone}" class="btn btn-success btn-sm w-100 fw-bold shadow-sm">
                                一键拨号
                            </a>
                        </div>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}


// 3. 唯一的过滤函数（已修正字段名为 category）
function filterData(keyword) {
  // 更新按钮样式
  const buttons = document.querySelectorAll("#categoryFilter button");
  buttons.forEach((btn) => {
    // 这里的判断逻辑根据你的 HTML 按钮文字来匹配
    if (
      btn.innerText.includes(keyword) ||
      (keyword === "全部" && btn.innerText === "全部")
    ) {
      btn.classList.remove("btn-outline-primary");
      btn.classList.add("btn-primary");
    } else {
      btn.classList.remove("btn-primary");
      btn.classList.add("btn-outline-primary");
    }
  });

  // 核心过滤逻辑：使用英文 category 字段
  const filtered =
    keyword === "全部"
      ? allWorkers
      : allWorkers.filter((w) => w.category && w.category.includes(keyword));

  render(filtered);
}
