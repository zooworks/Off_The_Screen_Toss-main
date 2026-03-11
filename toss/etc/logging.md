---
url: 'https://developers-apps-in-toss.toss.im/analytics/logging.md'
description: 데이터 분석 로깅 가이드입니다. 이벤트 로그 전송 및 분석 방법을 확인하세요.
---

# 로그 (이벤트)

**로깅은 미니앱의 성과를 높이는 가장 중요한 도구예요.**\
사용자의 행동과 요소 노출을 기록하면, **이탈 지점을 파악하고, 전환율을 개선하며, 더 많은 트래픽을 유도**할 수 있어요.

👉 단순히 데이터를 쌓는 게 아니라, 로깅을 통해 **사용자가 어디에서 멈추는지**와 **무엇에 반응하는지**를 알 수 있어요.\
이를 기반으로 기능을 개선하고, 마케팅 전략에도 활용할 수 있답니다.

* **페이지 이동 로그**는 자동으로 기록되므로 추가 설정이 필요 없어요.
* 나머지 상호작용과 노출 로그는 직접 설정하면 더 정교한 분석이 가능해요.

트래픽을 높이고 싶다면 반드시 로깅을 적극적으로 활용하세요!

## 로깅을 잘 활용하는 방법

* **의미 있는 상호작용만 로깅하기**\
  → 버튼 클릭, 상품 조회, 구매 완료 등 실제 분석 가치가 있는 지점만 기록하세요.
* **추가 파라미터를 구체적으로 설정하기**\
  → 예: 단순히 “버튼 클릭”이 아니라 `button_name: "subscribe_button"`처럼 구체적으로 지정하면, 어떤 기능이 성과를 내는지 뚜렷하게 분석할 수 있어요.
* **전환율 최적화에 활용하기**\
  → 어떤 단계에서 이탈이 많은지 알면, UI 개선이나 프로모션을 타겟팅할 수 있어요.

::: tip 참고하세요
**SDK 0.0.26 버전 이상**이 적용된 미니앱만 데이터 확인이 가능해요.\
샌드박스나 출시 준비 단계의 데이터는 제공되지 않으며, 실제 런칭 이후 데이터만 확인할 수 있어요.\
**서비스 런칭 후 하루 뒤부터** 데이터를 볼 수 있어요.
:::

## 클릭 이벤트 로깅

사용자가 버튼을 클릭하는 등의 상호작용을 기록하는 방법이에요.

```javascript
import { Analytics } from "@apps-in-toss/web-framework";

// 'myButton' 버튼을 클릭하면 'my_button' 이벤트를 로깅해요.
document.getElementById("myButton").addEventListener("click", function () {
  Analytics.click({ button_name: "my_button" });
  // 클릭 후 실행할 추가 동작은 여기에 작성하세요.
});
```

* [`Analytics.click`](/bedrock/reference/framework/분석/Analytics) 메서드는 클릭 이벤트를 로깅해요.
* `button_name` 파라미터는 어떤 버튼인지 식별할 이름이에요. (예: 'my\_button')
* 클릭 데이터를 쌓으면, **어떤 버튼이 실제로 전환율을 높이는지 파악할 수 있어요.**

## 요소 노출 이벤트 로깅

화면에 특정 요소가 노출될 때 이벤트를 기록하면, **사용자가 어떤 상품이나 콘텐츠에 더 관심을 가지는지 파악할 수 있어요.**

```javascript
import { Analytics } from "@apps-in-toss/web-framework";

const target = document.getElementById("impressionItem");

const observer = new IntersectionObserver(
  ([entry]) => {
    if (entry.isIntersecting) {
      Analytics.impression({ item_id: target.dataset.itemId });
      observer.disconnect();
    }
  },
  { threshold: 0.1 }
);

observer.observe(target);
```

* `IntersectionObserver`는 요소가 화면에 10% 이상 노출될 때 콜백을 실행해요.
* [`Analytics.impression`](/bedrock/reference/framework/분석/LoggingImpression) 메서드는 노출 이벤트를 로깅해요.
* `item_id` 파라미터는 어떤 아이템이 노출됐는지 식별할 ID예요. (예: '1234')
* 노출 로그를 활용하면, **어떤 상품이 많이 보였는데도 클릭이나 구매로 이어지지 않았는지** 확인할 수 있어요.

### HTML 예시

```html
<div id="impressionItem" data-item-id="1234">노출을 감지할 요소</div>
```

## 콘솔 가이드

설정한 로깅 데이터는 콘솔의 **분석 > 이벤트** 메뉴에서 확인할 수 있어요.

![](/assets/logging_1.DQYeJuNA.png)

![](/assets/logging_2.Qxh0gsUs.png)

👉 이 화면에서 클릭률, 노출 대비 전환율, 주요 이탈 지점을 확인하고, 실제 서비스 개선에 바로 활용하세요.

✅ **로깅은 미니앱 성공을 좌우하는 필수 기능이에요.**\
파트너사에서 많이 활용할수록 **더 많은 트래픽과 전환율 개선 효과**를 누릴 수 있어요.
