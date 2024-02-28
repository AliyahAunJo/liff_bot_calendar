document.addEventListener('DOMContentLoaded', async function() {
  await liff.init({ liffId: '2001536651-Q31WXa3x' }); // ไอดี liff

  if (liff.isLoggedIn()) {
    try {
      const urlParams = new URLSearchParams(window.location.search);
      const month = urlParams.get('month');
      window.history.pushState({}, document.title, "/")

      // console.log(month)
      const flexMSG = await fetchData(month);
    } catch (error) {
      console.error('Error', error);
    }
  } else {
    liff.login();
  }
});


const fetchData = (async (inputValue) => {
  const url = "https://script.google.com/macros/s/AKfycbzybg8PHbHtqlzQnmIT4lLieyXte-WqPKcqdeTIxz3HDoUrp7ldv-ICfooYk-9wbENw/exec"  // ลิงค์ exec


  const response = await fetch(url, {
    method: 'POST',
    // body: formData
  })

  const json = await response.json()
  console.log(json)
  console.log(parseInt(inputValue))
  let bubble = generateCalendarFlexMessage(json, (parseInt(inputValue)))

  let flex_btn = [{
    "type": "flex",
    "altText": "calendar",
    "contents": bubble
  }]

  await shareflex(flex_btn)
  $("#thank").html("ขอบคุณครับ ...")
  return json

})


const generateCalendarFlexMessage = (highlightedDates, monthcall) => {
  const thaiMonths = [
    'มกราคม',
    'กุมภาพันธ์',
    'มีนาคม',
    'เมษายน',
    'พฤษภาคม',
    'มิถุนายน',
    'กรกฎาคม',
    'สิงหาคม',
    'กันยายน',
    'ตุลาคม',
    'พฤศจิกายน',
    'ธันวาคม'
  ];

  let flextitle;
  let onYear = new Date().getFullYear()
  // const currentMonth2 = new Date(onYear+"/"+thaiMonths.indexOf(monthcall)+"/1").getMonth()+1;
  const currentMonth2 = new Date(onYear + "/" + monthcall + "/1").getMonth();


  // Logger.log("x1"+currentMonth2)

  const matchingDates = highlightedDates.filter((dateObj) => {
    // Logger.log("x2"+new Date(dateObj.date).getMonth())
    return new Date(dateObj.date).getMonth() === currentMonth2
  });


  if (matchingDates.length > 0) {
    flextitle = {
      "type": "box",
      "layout": "vertical",
      "contents": matchingDates.map(dateObj => {
        const dayOfWeek = new Date(dateObj.date).getDay(); // 0 (Sunday) to 6 (Saturday)
        let circleColor = "#FE0000"; // Default color (Pink)

        // Check day of the week and assign circle color accordingly
        if (dayOfWeek === 1) circleColor = "#F4CE14"; // Monday
        else if (dayOfWeek === 2) circleColor = "#F875AA"; // Tuesday
        else if (dayOfWeek === 3) circleColor = "#186F65"; // Wednesday
        else if (dayOfWeek === 4) circleColor = "#FF9B50"; // Thursday
        else if (dayOfWeek === 5) circleColor = "#00A9FF"; // Friday
        else if (dayOfWeek === 6) circleColor = "#6528F7"; // Saturday

        return {
          "type": "box",
          "layout": "vertical",
          "contents": [
            {
              "type": "box",
              "layout": "horizontal",
              "contents": [
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": new Date(dateObj.date).getDate().toString(),
                      "size": "md",
                      "align": "center",
                      "color": "#ffffff",
                      "wrap": true
                    },
                    {
                      "type": "text",
                      "text": new Date(dateObj.date).toLocaleString('en-us', { month: 'short' }),
                      "align": "center",
                      "color": "#FFFFFF"
                    }
                  ],
                  "backgroundColor": circleColor, // กำหนดสีวงกลม
                  "cornerRadius": "50px",
                  "width": "45px",
                  "height": "45px",
                  "justifyContent": "center",
                  "alignItems": "center"
                },
                {
                  "type": "box",
                  "layout": "vertical",
                  "contents": [
                    {
                      "type": "text",
                      "text": dateObj.title,
                      "size": "md",
                      "color": "#1B6B93",
                      "wrap": true,
                      "margin": "none",
                      "align": "end",
                      "weight": "bold"
                    }, {
                      "type": "text",
                      "text": "id : " + dateObj.id,
                      "size": "sm",
                      "color": "#B15EFF",
                      "wrap": true,
                      "margin": "none",
                      "align": "end",
                      "weight": "bold"
                    }
                  ],
                  "justifyContent": "center"
                }
              ],
              "margin": "none"
            }
          ],
          "backgroundColor": "#E0F4FF",
          "cornerRadius": "10px",
          "margin": "sm",
          "justifyContent": "center",
          "height": "50px",
          "paddingStart": "sm",
          "paddingEnd": "sm"
        }//end return
      }) // end map
    }

  } else {
    flextitle = {
      type: "box",
      layout: "vertical",
      contents: [] // ส่งค่าว่างเมื่อไม่มีกิจกรรมในเดือนปัจจุบัน
    }
  }


  let indexmonth = monthcall
  const today = new Date("2024" + "/" + indexmonth + "/1");
  const currentMonth = thaiMonths[today.getMonth()];
  const currentYear = today.getFullYear();

  /** หาจำนวนวันในเดือนปัจจุบัน */
  const daysInMonth = new Date(currentYear, today.getMonth() + 1, 0).getDate();
  // Logger.log(daysInMonth) 

  /** หาวันแรกของเดือนปัจจุบัน */
  const firstDayOfMonth = new Date(currentYear, today.getMonth(), 1);
  // Logger.log(firstDayOfMonth)

  /** หาว่าวันที่ 1 ของเดือนเป็นวันอะไร อ - ส */
  const startingDayOfWeek = firstDayOfMonth.getDay();
  // Logger.log(startingDayOfWeek)

  const rows = [[]];
  let currentRow = 0;

  /** หาว่าเดือนก่อนหน้ามีกี่วัน */
  const lastMonthLastDay = new Date(currentYear, today.getMonth(), 0).getDate();
  // Logger.log(lastMonthLastDay)

  /** จาก for นี้ ตัวอย่างคือ startingDayOfWeek = 3 lastMonthLastDay = 31 แล้วสั่ง loop เพื่อให้ส่งตัวเลขทีละตัวเริ่มตั้งแต่ เอา lastMonthLastDay - startingDayOfWeek + i + 1 มาคำนวน ในที่นี้จะรอบแรกได้เลข 29 ต่อไป 30 จนครบ จำนวนรอบ หรือ i < startingDayOfWeek  */
  //วันที่ของเดือนที่ผ่านมาที่เป็นเศษของแถว
  for (let i = 0; i < startingDayOfWeek; i++) {
    rows[currentRow].push({
      type: 'box',
      layout: 'vertical',
      borderColor: "#B2C8BA",
      borderWidth: "2px",
      alignItems: "center",
      cornerRadius: "5px",
      paddingAll: "sm",
      contents: [
        {
          type: 'text',
          text: `${lastMonthLastDay - startingDayOfWeek + i + 1}`,
          color: "#EAD7BB",
          flex: 1,
        }
      ]
    });
  }

  // ส่วนที่แสดงวันที่
  for (let i = 1; i <= daysInMonth; i++) {
    let isHighlightDay = highlightedDates.some(dateObj => dateObj.date === `${currentYear}/${today.getMonth() + 1}/${i}`);

    if (rows[currentRow].length === 7) {
      currentRow++;
      rows[currentRow] = [];
    }
    rows[currentRow].push({
      type: 'box',
      layout: 'vertical',
      borderColor: "#B2C8BA",
      borderWidth: "2px",
      alignItems: "center",
      cornerRadius: "5px",
      paddingAll: "sm",
      contents: [
        {
          type: 'text',
          text: `${i}`,
          color: isHighlightDay ? "#FF0000" : "#0802A3",
          flex: 1,
        }
      ]
    });
  }

  let nextMonthDayCounter = 1;
  for (let i = rows[currentRow].length; i < 7; i++) {
    rows[currentRow].push({
      type: 'box',
      layout: 'vertical',
      borderColor: "#B2C8BA",
      borderWidth: "2px",
      alignItems: "center",
      cornerRadius: "5px",
      paddingAll: "sm",
      contents: [
        {
          type: 'text',
          text: `${nextMonthDayCounter}`,
          flex: 1,
          color: "#EAD7BB"
        }
      ]
    });
    nextMonthDayCounter++;
  }

  /** ทดสอบก่อน */
  const test = rows.map(row => ({ row }))
  console.log(JSON.stringify(test))

  /** นำค่าวันที่ flex ที่เป็นแต่ละ ro มาใใส่ใน bubble */
  const bodyContents = rows.map(row => ({
    type: 'box',
    layout: 'horizontal',
    contents: row
  }));

  const bubble = {
    type: 'bubble',
    size: "giga",
    direction: 'ltr',
    body: {
      type: 'box',
      backgroundColor: '#F6F1EE',
      layout: 'vertical',
      contents: [
        {
          type: 'text',
          text: 'Calendar',
          weight: 'bold',
          size: 'xl',
          align: 'center',
          color: '#1B6B93'
        },
        {
          type: 'text',
          text: `${currentMonth} ${currentYear}`,
          size: 'lg',
          align: 'center',
          margin: 'md',
          color: '#1B6B93'
        },
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "box",
              layout: "vertical",
              contents: [{ type: "text", text: "Sun", align: "center", color: "#FFFFFF" }],
              backgroundColor: "#FF0000"
            },
            {
              type: "box",
              layout: "vertical",
              contents: [{ type: "text", text: "Mon", align: "center", color: "#FFFFFF" }],
              backgroundColor: "#FFFF00"
            },
            {
              type: "box",
              layout: "vertical",
              contents: [{ type: "text", text: "Tue", align: "center", color: "#FFFFFF" }],
              backgroundColor: "#FF69B4"
            },
            {
              type: "box",
              layout: "vertical",
              contents: [{ type: "text", text: "Wed", align: "center", color: "#FFFFFF" }],
              backgroundColor: "#008000"
            },
            {
              type: "box",
              layout: "vertical",
              contents: [{ type: "text", text: "Thu", align: "center", color: "#FFFFFF" }],
              backgroundColor: "#FFA500"
            },
            {
              type: "box",
              layout: "vertical",
              contents: [{ type: "text", text: "Fri", align: "center", color: "#FFFFFF" }],
              backgroundColor: "#00BFFF"
            },
            {
              type: "box",
              layout: "vertical",
              contents: [{ type: "text", text: "Sat", align: "center", color: "#FFFFFF" }],
              backgroundColor: "#800080"
            }
          ],
        },

        ...bodyContents, flextitle
      ]
    },

    footer: {
      type: "box",
      layout: "vertical",
      contents: [
        {
          type: "box",
          layout: "horizontal",
          contents: [
            {
              type: "text",
              text: "Dev by ครูอั๋น ใจดี # since 2023",
              color: "#FFFFFF",
              weight: "regular",
              align: "end"
            }
          ]
        }
      ],
      backgroundColor: "#176B87"
    }
  };
  // Logger.log(JSON.stringify(bubble))
  return bubble
}


async function shareflex(flex) {
  try {
    await liff.shareTargetPicker(flex, {
      isMultiple: true,
    });
    liff.closeWindow();
  } catch (error) {
    console.error('Error sharing flex message', error);
  }
}
