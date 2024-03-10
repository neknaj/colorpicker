function ColorPicker(colorpicker,handleSize,margin) {
    let Handle_Hue = 0;
    let Handle_Saturation = 100;
    let Handle_Luminance = 50;
    let Handle_stat = 0;
    colorpicker.dataset.value = [Handle_Hue,Handle_Saturation,Handle_Luminance].join(",");
    const UpdateUI = ()=>{
        const ccR = [128-handleSize,128];
        const ctx = colorpicker.getContext("2d");
        colorpicker.height = 256+margin*2;
        colorpicker.width = 256+handleSize*2+margin*4;
        const Line = (p1,p2) => {
            ctx.beginPath();
            ctx.moveTo(...p1); ctx.lineTo(...p2);
            ctx.stroke();
        }
        const Handle = (p) => {
            ctx.lineWidth = 5; ctx.strokeStyle = "black";
            ctx.beginPath();ctx.arc(...p,handleSize/2,0,Math.PI*2);ctx.stroke();
            ctx.lineWidth = 2; ctx.strokeStyle = "white";
            ctx.beginPath();ctx.arc(...p,handleSize/2,0,Math.PI*2);ctx.stroke();
        }
        const Cap = (p,color) => {
            ctx.fillStyle = `hsl(${color[0]}deg,${color[1]}%,${color[2]}%)`;
            ctx.beginPath();ctx.arc(...p,handleSize/2,0,Math.PI*2);ctx.fill();
        }
        for (let i=0;i<360;i+=1) { // H
            const theta = i*Math.PI/180; ctx.lineWidth = 3;
            ctx.strokeStyle = `hsl(${i}deg,${Handle_Saturation}%,${Handle_Luminance}%)`;
            Line([Math.cos(theta)*ccR[0]+128+margin,Math.sin(theta)*ccR[0]+128+margin],[Math.cos(theta)*ccR[1]+128+margin,Math.sin(theta)*ccR[1]+128+margin]);
        }
        { // S,L
            {
                Cap([256+margin*2+handleSize/2,handleSize/2+margin],[Handle_Hue,100,Handle_Luminance]);
                Cap([256+margin*2+handleSize/2,256-handleSize/2+margin],[Handle_Hue,0,Handle_Luminance]);
                Cap([256+margin*3+handleSize+handleSize/2,handleSize/2+margin],[Handle_Hue,Handle_Saturation,100]);
                Cap([256+margin*3+handleSize+handleSize/2,256-handleSize/2+margin],[Handle_Hue,Handle_Saturation,0]);
            }
            for (let t=0;t<=100;t+=1) {
                ctx.lineWidth = 4;
                const i = t*(256-margin*2-handleSize/2)/100+handleSize/2;
                { // S
                    ctx.strokeStyle = `hsl(${Handle_Hue}deg,${100-t}%,${Handle_Luminance}%)`;
                    Line([256+margin*2,i+margin],[256+margin*2+handleSize,i+margin]);
                }
                { // L
                    ctx.strokeStyle = `hsl(${Handle_Hue}deg,${Handle_Saturation}%,${100-t}%)`;
                    Line([256+margin*3+handleSize,i+margin],[256+margin*3+handleSize*2,i+margin]);
                }
            }
        }
        { // ハンドル
            const Handle_Hue_theta = Handle_Hue*Math.PI/180;
            const arcR = (ccR[1]+ccR[0])/2;
            Handle([Math.cos(Handle_Hue_theta)*arcR+128+margin,Math.sin(Handle_Hue_theta)*arcR+128+margin]); // Hのハンドル
            Handle([256+margin*2+handleSize*0.5,(100-Handle_Saturation)*(256-handleSize)/100+margin+handleSize/2]); // Sのハンドル
            Handle([256+margin*3+handleSize*1.5,(100-Handle_Luminance)*(256-handleSize)/100+margin+handleSize/2]);// Lのハンドル
        }
        { // 選択中の色
            {
                ctx.fillStyle = `hsl(${Handle_Hue}deg,${Handle_Saturation}%,${Handle_Luminance}%)`;
                ctx.beginPath();
                ctx.arc(128+margin,128+margin,ccR[0]-margin,0,Math.PI*2);
                ctx.fill();
            }
            {
                ctx.font = "25px serif";
                ctx.textAlign = "center";
                ctx.fillStyle = `hsl(${180-Handle_Hue}deg,${100-Handle_Saturation}%,${100-Handle_Luminance}%)`;
                ctx.fillText(`${Handle_Hue},${Handle_Saturation},${Handle_Luminance}`, 128+margin, 128+margin+10);
            }
        }
    }
    const getPointer = (e)=>{
        const rect = colorpicker.getBoundingClientRect();
        return [(e.clientX-rect.left)/(rect.right-rect.left)*colorpicker.width,(e.clientY-rect.top)/(rect.bottom-rect.top)*colorpicker.height];
    }
    const distance = (p1,p2)=>{
        return Math.sqrt((p2[0]-p1[0])**2+(p2[1]-p1[1])**2);
    }
    UpdateUI();
    colorpicker.onpointerdown = (e)=>{
        const p = getPointer(e);
        const Handle_Hue_theta = Handle_Hue*Math.PI/180;
        const arcR = (256-handleSize)/2;
        let h = distance(p,[Math.cos(Handle_Hue_theta)*arcR+128+margin,Math.sin(Handle_Hue_theta)*arcR+128])<handleSize;
        let s = distance(p,[256+margin*2+handleSize*0.5,(100-Handle_Saturation)*(256-handleSize)/100+margin+handleSize/2])<handleSize;
        let l = distance(p,[256+margin*3+handleSize*1.5,(100-Handle_Luminance)*(256-handleSize)/100+margin+handleSize/2])<handleSize;
        Handle_stat = 0;
        if (h) Handle_stat = 1;
        if (s) Handle_stat = 2;
        if (l) Handle_stat = 3;
        if (Handle_stat!=0) {
            e.target.setPointerCapture(e.pointerId);
        }
    }
    colorpicker.onpointerup = (e)=>{
        Handle_stat = 0;
    }
    colorpicker.onpointermove = (e)=>{
        const p = getPointer(e);
        if (Handle_stat==1) {
            let v = 180+Math.atan2(-p[1]+(128+margin),-p[0]+(128+margin))*180/Math.PI;
            Handle_Hue = Math.floor(v);
            UpdateUI();
            const event = new CustomEvent("changeColor", { detail:[Handle_Hue,Handle_Saturation,Handle_Luminance] });
            colorpicker.dispatchEvent(event);
        }
        else if (Handle_stat==2) {
            let v = Math.min(Math.max(100-(p[1]-margin-handleSize/2)/(256-handleSize)*100,0),100);
            Handle_Saturation = Math.floor(v);
            UpdateUI();
            const event = new CustomEvent("changeColor", { detail:[Handle_Hue,Handle_Saturation,Handle_Luminance] });
            colorpicker.dispatchEvent(event);
        }
        else if (Handle_stat==3) {
            let v = Math.min(Math.max(100-(p[1]-margin-handleSize/2)/(256-handleSize)*100,0),100);
            Handle_Luminance = Math.floor(v);
            UpdateUI();
            const event = new CustomEvent("changeColor", { detail:[Handle_Hue,Handle_Saturation,Handle_Luminance] });
            colorpicker.dispatchEvent(event);
        }
        colorpicker.dataset.value = [Handle_Hue,Handle_Saturation,Handle_Luminance].join(",");
    }
}