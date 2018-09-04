
import {test} from 'tape';
import Delaunator from './index.js';

const points = [[168, 180], [168, 178], [168, 179], [168, 181], [168, 183], [167, 183], [167, 184], [165, 184], [162, 186], [164, 188], [161, 188], [160, 191], [158, 193], [156, 193], [152, 195], [152, 198], [150, 198], [147, 198], [148, 205], [150, 210], [148, 210], [148, 208], [145, 206], [142, 206], [140, 206], [138, 206], [135, 206], [135, 209], [131, 209], [131, 211], [127, 211], [124, 210], [120, 207], [120, 204], [120, 202], [124, 201], [123, 201], [125, 198], [125, 194], [127, 194], [127, 191], [130, 191], [132, 189], [134, 189], [134, 186], [136, 184], [134, 182], [134, 179], [134, 176], [136, 174], [139, 174], [141, 177], [142, 176], [144, 176], [147, 178], [148, 176], [151, 178], [154, 178], [153, 175], [152, 174], [152, 170], [152, 168], [150, 166], [148, 166], [147, 165], [145, 162], [146, 160], [146, 157], [146, 155], [144, 155], [142, 152], [140, 150], [138, 150], [138, 148], [140, 145], [140, 142], [140, 138], [139, 138], [137, 138], [135, 138], [133, 135], [132, 132], [129, 132], [128, 132], [124, 132], [124, 130], [123, 130], [118, 126], [116, 124], [112, 122], [109, 122], [105, 122], [102, 124], [100, 124], [97, 124], [95, 126], [92, 127], [89, 127], [88, 130], [85, 132], [80, 134], [72, 134], [69, 134], [65, 138], [64, 138], [58, 137], [56, 133], [52, 133], [51, 133], [48, 133], [44, 133], [41, 131], [38, 130], [35, 130], [32, 127], [30, 127], [27, 127], [24, 127], [24, 126], [23, 124], [20, 122], [17, 122], [16, 118], [15, 116], [15, 110], [18, 108], [20, 102], [24, 97], [28, 102], [28, 98], [26, 97], [28, 94], [27, 85], [29, 79], [32, 76], [39, 70], [44, 66], [48, 65], [53, 61], [53, 58], [51, 54], [54, 54], [52, 48], [51, 43], [48, 42], [49, 38], [48, 34], [51, 30], [53, 33], [58, 30], [61, 30], [60, 27], [64, 26], [68, 24], [74, 24], [80, 24], [85, 26], [92, 26], [96, 29], [103, 32], [109, 33], [112, 37], [116, 37], [120, 37], [124, 35], [126, 35], [128, 38], [132, 38], [134, 41], [138, 38], [140, 36], [142, 40], [144, 43], [145, 41], [149, 41], [155, 41], [159, 41], [161, 46], [165, 46], [164, 42], [164, 39], [164, 34], [167, 30], [173, 24], [178, 24], [184, 24], [189, 26], [195, 21], [195, 20], [199, 20], [203, 20], [207, 17], [211, 17], [216, 17], [218, 16], [222, 22], [225, 27], [228, 31], [226, 34], [224, 34], [226, 39], [228, 43], [230, 46], [236, 46], [242, 46], [243, 50], [245, 50], [247, 54], [247, 56], [248, 60], [248, 65], [253, 66], [255, 64], [260, 64], [264, 67], [268, 71], [272, 66], [275, 66], [281, 61], [285, 66], [286, 70], [292, 74], [294, 74], [296, 74], [296, 71], [301, 74], [307, 74], [311, 78], [315, 74], [315, 77], [319, 77], [322, 82], [328, 82], [331, 81], [331, 84], [333, 86], [333, 90], [330, 95], [326, 98], [328, 99], [332, 98], [333, 101], [331, 104], [329, 104], [327, 106], [329, 111], [332, 116], [333, 119], [333, 122], [332, 126], [332, 130], [327, 130], [321, 130], [317, 130], [315, 134], [312, 134], [308, 138], [306, 138], [306, 144], [306, 149], [306, 152], [301, 152], [297, 154], [295, 154], [292, 154], [292, 158], [288, 158], [283, 162], [281, 164], [279, 163], [276, 163], [273, 166], [272, 169], [268, 168], [265, 170], [260, 172], [256, 176], [252, 176], [248, 181], [246, 182], [246, 189], [246, 194], [248, 197], [250, 198], [252, 200], [252, 203], [254, 205], [260, 205], [264, 202], [267, 202], [269, 202], [272, 199], [280, 199], [278, 202], [278, 207], [278, 211], [276, 211], [272, 213], [268, 213], [265, 213], [264, 211], [262, 210], [260, 210], [257, 212], [257, 214], [255, 217], [253, 217], [253, 221], [249, 220], [247, 220], [243, 222], [240, 223], [239, 226], [234, 231], [229, 231], [224, 231], [219, 227], [220, 227], [222, 224], [222, 222], [222, 219], [224, 217], [222, 214], [220, 212], [217, 210], [215, 210], [211, 209], [208, 206], [202, 209], [202, 205], [206, 202], [211, 198], [216, 195], [220, 192], [224, 192], [221, 186], [218, 186], [214, 185], [208, 185], [204, 186], [200, 186], [193, 183], [190, 182], [188, 182], [190, 178], [186, 178], [184, 174], [182, 171], [178, 171], [173, 174], [169, 174], [169, 175], [169, 179], [167, 182], [164, 186], [160, 192], [155, 195], [152, 198], [150, 198], [148, 198], [148, 202], [151, 208], [148, 210], [146, 208], [144, 205], [140, 205], [137, 208], [132, 208], [132, 210], [127, 210], [124, 210], [120, 206], [120, 202], [123, 202], [124, 201], [124, 198], [128, 195], [131, 191], [133, 187], [135, 183], [130, 203], [129, 208], [123, 203], [129, 203], [129, 198], [133, 198], [136, 200], [142, 200], [143, 199], [143, 197], [137, 196], [136, 194], [133, 194], [136, 186], [136, 182], [141, 186], [144, 186], [150, 186], [150, 190], [155, 190], [159, 188], [156, 182], [151, 182], [144, 182], [164, 176], [161, 177], [157, 177], [166, 176], [168, 165], [175, 167], [180, 167], [188, 159], [195, 164], [195, 162], [187, 162], [178, 163], [173, 166], [168, 170], [156, 170], [157, 165], [164, 165], [164, 161], [170, 159], [167, 158], [159, 154], [149, 151], [145, 145], [145, 138], [152, 138], [152, 146], [159, 146], [165, 153], [176, 153], [180, 153], [187, 153], [194, 153], [202, 153], [202, 158], [197, 158], [193, 158], [193, 142], [180, 142], [171, 142], [163, 135], [176, 135], [186, 139], [201, 139], [206, 139], [205, 147], [205, 160], [198, 160], [206, 174], [205, 178], [196, 178], [196, 182], [202, 182], [206, 181], [209, 181], [215, 181], [222, 181], [230, 177], [238, 175], [241, 175], [237, 175], [237, 168], [237, 161], [232, 156], [231, 162], [225, 166], [217, 169], [210, 173], [224, 173], [227, 173], [235, 175], [237, 178], [228, 192], [222, 199], [216, 199], [211, 204], [205, 206], [219, 207], [222, 211], [229, 214], [236, 214], [244, 211], [247, 211], [268, 206], [277, 201], [279, 201], [281, 202], [278, 202], [242, 178], [236, 170], [236, 162], [255, 162], [251, 156], [240, 156], [253, 152], [261, 152], [277, 157], [268, 151], [255, 143], [260, 142], [267, 145], [271, 149], [273, 154], [258, 146], [257, 131], [256, 134], [248, 137], [260, 137], [260, 134], [271, 137], [276, 138], [276, 144], [289, 144], [285, 150], [294, 150], [298, 149], [301, 145], [292, 145], [282, 134], [276, 134], [283, 127], [282, 116], [277, 113], [283, 113], [288, 106], [296, 106], [297, 113], [297, 118], [298, 118], [310, 122], [310, 128], [300, 130], [300, 140], [292, 129], [292, 114], [283, 122], [289, 122], [299, 122], [299, 134], [294, 134], [288, 124], [314, 121], [311, 113], [308, 110], [304, 96], [299, 90], [299, 82], [305, 87], [309, 94], [311, 101], [312, 102], [314, 107], [320, 112], [320, 115], [326, 116], [323, 109], [321, 102], [321, 94], [321, 90], [328, 90], [328, 88], [316, 88], [316, 84], [307, 84], [290, 77], [289, 88], [289, 97], [278, 97], [268, 106], [268, 110], [261, 105], [255, 103], [244, 103], [252, 100], [252, 91], [252, 82], [242, 78], [252, 78], [259, 78], [264, 87], [267, 92], [272, 91], [272, 83], [264, 83], [260, 79], [276, 79], [283, 84], [283, 94], [289, 94], [284, 86], [272, 77], [253, 110], [248, 110], [239, 110], [234, 114], [222, 125], [219, 127], [219, 131], [219, 138], [219, 141], [224, 139], [224, 135], [225, 130], [232, 136], [240, 138], [237, 131], [237, 118], [248, 120], [256, 122], [262, 127], [255, 118], [245, 110], [207, 129], [199, 134], [195, 134], [188, 130], [180, 130], [165, 129], [156, 129], [165, 128], [173, 125], [185, 126], [193, 126], [201, 124], [204, 123], [208, 116], [214, 114], [207, 114], [196, 114], [183, 121], [183, 111], [189, 117], [196, 112], [172, 126], [164, 126], [159, 114], [174, 106], [186, 106], [192, 105], [184, 105], [184, 96], [173, 96], [163, 111], [159, 110], [152, 110], [168, 110], [171, 106], [183, 98], [193, 101], [219, 96], [225, 97], [225, 104], [232, 92], [240, 92], [237, 86], [229, 86], [216, 88], [214, 79], [203, 79], [203, 75], [212, 75], [221, 75], [229, 80], [230, 89], [217, 88], [217, 77], [228, 77], [228, 69], [235, 71], [240, 71], [244, 66], [236, 54], [236, 62], [232, 68], [229, 61], [216, 61], [212, 58], [212, 47], [212, 39], [214, 28], [215, 48], [225, 55], [236, 55], [202, 65], [202, 54], [202, 44], [202, 24], [198, 32], [199, 38], [192, 38], [185, 38], [174, 42], [174, 48], [178, 51], [184, 51], [194, 55], [191, 68], [182, 68], [174, 69], [167, 67], [153, 59], [153, 49], [147, 49], [152, 58], [152, 74], [154, 83], [161, 83], [165, 88], [153, 97], [153, 89], [152, 82], [168, 88], [168, 101], [156, 102], [156, 119], [173, 110], [184, 110], [177, 106], [160, 106], [145, 125], [137, 122], [131, 120], [124, 120], [122, 118], [113, 118], [114, 111], [129, 111], [140, 110], [143, 106], [137, 102], [127, 102], [119, 98], [126, 93], [139, 93], [139, 99], [141, 95], [128, 89], [118, 74], [128, 76], [135, 76], [141, 83], [141, 71], [137, 61], [137, 50], [129, 50], [118, 50], [109, 52], [112, 61], [123, 60], [134, 60], [129, 76], [121, 67], [124, 76], [123, 76], [111, 74], [128, 73], [109, 83], [109, 94], [105, 103], [102, 118], [92, 113], [98, 105], [99, 93], [94, 93], [94, 81], [99, 81], [100, 73], [100, 89], [100, 60], [100, 55], [105, 37], [101, 34], [93, 37], [90, 37], [90, 49], [99, 49], [88, 68], [80, 68], [78, 64], [88, 62], [86, 77], [76, 89], [71, 91], [71, 106], [78, 106], [82, 118], [84, 110], [71, 104], [76, 103], [76, 91], [78, 83], [85, 89], [83, 103], [83, 119], [76, 130], [62, 130], [68, 127], [74, 126], [83, 123], [62, 123], [56, 123], [59, 129], [59, 120], [49, 110], [46, 106], [56, 100], [62, 94], [62, 109], [72, 112], [67, 112], [57, 112], [61, 122], [60, 102], [52, 125], [44, 121], [36, 114], [32, 110], [20, 110], [22, 118], [35, 118], [44, 124], [32, 119], [22, 111], [44, 96], [36, 106], [36, 94], [32, 94], [35, 83], [44, 91], [52, 91], [52, 80], [59, 80], [62, 76], [62, 70], [47, 78], [55, 75], [64, 71], [64, 60], [58, 53], [58, 43], [65, 43], [65, 60], [76, 52], [73, 38], [76, 36], [93, 48], [89, 39], [99, 40], [98, 50], [94, 63], [117, 63], [131, 67], [131, 74], [142, 78], [140, 61], [124, 58], [124, 48], [136, 55], [236, 200], [228, 200], [226, 192], [232, 198], [238, 210], [248, 210], [236, 220], [230, 223], [230, 213], [175, 32], [172, 32], [171, 38], [184, 30]];

test('triangulates plain array', (t) => {
    const d = new Delaunator([].concat(...points));
    t.same(d.triangles, Delaunator.from(points).triangles);
    t.end();
});

test('triangulates typed array', (t) => {
    const d = new Delaunator(Float64Array.from([].concat(...points)));
    t.same(d.triangles, Delaunator.from(points).triangles);
    t.end();
});

test('constructor errors on invalid array', (t) => {
    /* eslint no-new: 0 */
    t.throws(() => {
        new Delaunator({length: -1});
    }, /Invalid typed array length/);
    t.throws(() => {
        new Delaunator(points);
    }, /Expected coords to contain numbers/);
    t.end();
});

test('produces correct triangulation', (t) => {
    validate(t, points);
    t.end();
});

test('issue #11', (t) => {
    validate(t, [[516, 661], [369, 793], [426, 539], [273, 525], [204, 694], [747, 750], [454, 390]]);
    t.end();
});

test('issue #24', (t) => {
    validate(t, [[382, 302], [382, 328], [382, 205], [623, 175], [382, 188], [382, 284], [623, 87], [623, 341], [141, 227]]);
    t.end();
});

test('issue #13', (t) => {
    validate(t, [[4, 1], [3.7974166882130675, 2.0837249985614585], [3.2170267516619773, 3.0210869309396715], [2.337215067329615, 3.685489874065187], [1.276805078389906, 3.9872025288851036], [0.17901102978375127, 3.885476929518457], [-0.8079039091377689, 3.3940516818407187], [-1.550651407188842, 2.5792964886320684], [-1.9489192990517052, 1.5512485534497125], [-1.9489192990517057, 0.44875144655029087], [-1.5506514071888438, -0.5792964886320653], [-0.8079039091377715, -1.394051681840717], [0.17901102978374794, -1.8854769295184561], [1.276805078389902, -1.987202528885104], [2.337215067329611, -1.6854898740651891], [3.217026751661974, -1.021086930939675], [3.7974166882130653, -0.08372499856146409]]);
    t.end();
});

test('robustness', (t) => {
    const points = [[66.103648384371410, 68.588612471664760], [146.680713462100413, 121.680713462100428], [128.868896560467447, 117.261797559041411], [66.103648384371439, 68.588612471664774], [169.552139667571992, 146.133776538276890], [126.629392246050883, 181.111404660392082], [74.434448280233709, 78.630898779520691], [121.111404660392054, 153.370607753949116], [98.888595339607888, 186.629392246050855], [52.660668968140221, 63.178539267712423], [85.321337936280443, 86.357078535424832], [129.615705608064615, 173.901806440322616], [91.522409349774278, 162.346331352698143], [137.240951282800551, 112.240951282800537], [93.370607753949116, 158.888595339607917], [175, 150], [124.142135623730908, 184.142135623730979], [96.208227592327205, 94.083258291328988], [98.888595339607988, 153.370607753949059], [117.982006904420700, 109.535617803137270], [116.194470264303831, 108.267043413376910], [54.324378061245710, 62.306334965997713], [30.886889656046740, 47.726179755904141], [107.095117248373952, 101.809438047233129], [38.892261948632665, 52.594841299088443], [146.680713462100413, 121.680713462100399], [95.857864376269077, 155.857864376269020], [54.324378061245703, 62.306334965997706], [137.240951282800551, 112.240951282800551], [161.529565528607690, 140.440336826753821], [90.384294391935398, 166.098193559677383], [113.220729676874285, 93.717722494332946], [77.882918707497154, 74.870889977331813], [50, 60], [85.321337936280457, 86.357078535424847], [41.773779312093481, 55.452359511808289], [89.662189030622869, 81.153167482998867], [101.441459353748570, 87.435444988665906], [124.142135623730965, 155.857864376269048], [172.416455184654381, 148.166516582657948], [63.547558624186912, 70.904719023616522], [150.642675872560943, 132.714157070849694], [109.999999999999928, 190], [128.477590650225721, 177.653668647301827], [90, 169.999999999999943], [128.477590650225749, 162.346331352698200], [156.120475641400275, 131.120475641400275], [90.384294391935384, 173.901806440322502], [95.857864376268992, 184.142135623730894], [77.882918707497140, 74.870889977331799], [139.755786216514195, 124.987977314945553], [130, 170], [102.346331352698129, 188.477590650225693], [41.773779312093481, 55.452359511808282], [91.522409349774235, 177.653668647301714], [27.784523897265298, 45.189682598176865], [126.629392246050912, 158.888595339607974], [106.098193559677355, 189.615705608064587], [52.660668968140200, 63.178539267712395], [74.434448280233681, 78.630898779520677], [106.098193559677469, 150.384294391935384], [117.653668647301728, 188.477590650225749], [125, 100], [38.892261948632565, 52.594841299088379], [52.660668968140228, 63.178539267712416], [129.615705608064615, 166.098193559677440], [20, 40], [117.653668647301813, 151.522409349774278], [161.529565528607662, 140.440336826753821], [63.547558624186969, 70.904719023616564], [127.801189103500675, 102.801189103500675], [89.662189030622840, 81.153167482998853], [102.346331352698243, 151.522409349774250], [93.370607753949059, 181.111404660391968], [113.901806440322502, 189.615705608064615], [121.111404660391997, 186.629392246050940], [113.901806440322587, 150.384294391935384], [110.000000000000028, 150], [165.560237820700137, 140.560237820700137]];
    validate(t, points);
    validate(t, points.map(p => [p[0] / 1e9, p[1] / 1e9]));
    validate(t, points.map(p => [p[0] / 100, p[1] / 100]));
    validate(t, points.map(p => [p[0] * 100, p[1] * 100]));
    validate(t, points.map(p => [p[0] * 1e9, p[1] * 1e9]));
    validate(t, [[0.226270008640849, -0.5484478681473859], [0.22627000864084906, -0.5484478681473857], [0.766192698520777, -0.06114560279536302], [0.7661926985207771, -0.06114560279536302], [0.40151121510492016, 0.08616979557470032], [0.40151121510492027, 0.08616979557470034], [-0.41675996433129736, -0.5902787491305856], [-0.4167599643312972, -0.5902787491305853], [-0.2479064469635639, -0.7472011647497873], [-0.24790644696356384, -0.7472011647497872], [0.6078988481689899, -0.8087190266174613], [0.6078988481689901, -0.808719026617461], [0.6844238681986647, -0.22229148851718702], [0.6844238681986647, -0.222291488517187], [0.6486832941181451, 0.3706194950394349], [0.6486832941181452, 0.3706194950394349], [-0.5361048842131249, -0.16765691382574804], [-0.5361048842131245, -0.167656913825748], [0.4588358986737203, -0.9000280551977525], [0.4588358986737205, -0.9000280551977525], [0.3960651926938643, 0.19117525930527385], [0.39606519269386437, 0.1911752593052739], [0.30699987842448867, -0.4067155996580057], [0.3069998784244887, -0.4067155996580056], [0.47811583559881354, 0.4551485080955586], [0.47811583559881354, 0.4551485080955586], [0.5569494202770435, 0.3174275448747843], [0.5569494202770439, 0.3174275448747845], [-0.4277027605175392, 0.09695587866512022], [-0.4277027605175391, 0.09695587866512025], [-0.5748114807265807, -0.03838218657575568], [-0.5748114807265806, -0.03838218657575567], [-1.0317070883952917, -0.5245256032470283], [-1.031707088395291, -0.5245256032470283], [0.14712374452633492, 0.33141471681448986], [0.147123744526335, 0.33141471681448986], [-0.2834737219004291, -0.9271587984120542], [-0.2834737219004289, -0.9271587984120538], [-0.6098149486946731, 0.5553773725836295], [-0.6098149486946729, 0.5553773725836295], [1.1206314478250745, 0.3921423623286639], [1.1206314478250745, 0.39214236232866406], [0.4477538973665876, -0.04256704865570235], [0.4477538973665877, -0.04256704865570235], [-0.6156635308889042, -0.10817302193016937], [-0.6156635308889041, -0.10817302193016932], [0.17897362794557034, -0.04224227852769616], [0.17897362794557034, -0.04224227852769614], [-0.9646885789850332, -1.4563419829050452], [-0.9646885789850331, -1.456341982905045], [0.2911613415160255, 0.015655417967490592], [0.29116134151602563, 0.015655417967490596], [-0.3698918540831971, 0.6983267205999204], [-0.3698918540831969, 0.6983267205999205], [1.4056553730213062, -0.41615789580202767], [1.4056553730213066, -0.41615789580202767], [0.34141990921721344, -0.5679551502988661], [0.3414199092172136, -0.5679551502988661], [0.2957318137669341, 0.8416499601535058], [0.29573181376693425, 0.841649960153506], [0.035141462612931273, -0.45835970615650135], [0.03514146261293129, -0.45835970615650123], [-1.3263110033694971, 0.8223290351908346], [-1.326311003369497, 0.8223290351908346], [-0.18787969354847422, 1.4601214758378256], [-0.18787969354847417, 1.4601214758378258], [-0.5421684590742957, -0.5196118080038157], [-0.5421684590742956, -0.5196118080038157], [-0.15415956428809274, 0.2553265483092856], [-0.15415956428809266, 0.25532654830928564], [0.24744639466303925, 0.36561549310806263], [0.24744639466303933, 0.36561549310806274], [-0.007949225522230624, -0.4463313570187974], [-0.00794922552223062, -0.4463313570187972], [0.4314282749865176, 0.6907165244683744], [0.4314282749865177, 0.6907165244683744], [0.22721916356346672, -1.145924985720078], [0.22721916356346675, -1.1459249857200775], [0.11627266697915434, 0.5679584977485386], [0.11627266697915438, 0.5679584977485389], [-0.004760241854834868, 1.341758406463988], [-0.004760241854834866, 1.3417584064639887], [0.34070213758085, -0.4524446934513693], [0.3407021375808501, -0.45244469345136923], [0.8842875090593054, -0.4369329059094983], [0.8842875090593055, -0.43693290590949824], [0.1514286184534766, -0.17725085421066233], [0.15142861845347666, -0.17725085421066225], [-0.4255258812089902, -0.48986352859695054], [-0.42552588120899015, -0.4898635285969505], [0.9377261482762783, -0.1443481348548356], [0.9377261482762784, -0.14434813485483552], [0.04260345503852292, 0.951377045867543], [0.04260345503852292, 0.951377045867543], [0.305243584013604, -0.3875472629266138], [0.305243584013604, -0.3875472629266138], [0.03603755940893599, 0.34504467425927055], [0.036037559408936, 0.34504467425927055], [0.7432869522329792, -0.7836440067269177], [0.7432869522329795, -0.7836440067269175]]);
    t.end();
});

test('throws on small number of points', (t) => {
    t.throws(() => {
        Delaunator.from(points.slice(0, 1));
    });
    t.throws(() => {
        Delaunator.from(points.slice(0, 2));
    });
    t.end();
});

test('throws on all-collinear input', (t) => {
    t.throws(() => {
        Delaunator.from([[0, 0], [1, 0], [2, 0], [3, 0]]);
    });
    t.end();
});

test('supports custom point format', (t) => {
    const d = Delaunator.from(
        [{x: 5, y: 5}, {x: 7, y: 5}, {x: 7, y: 6}],
        p => p.x,
        p => p.y);
    t.same(d.triangles, [0, 2, 1]);
    t.end();
});

function validate(t, points) {
    const d = Delaunator.from(points);

    // validate halfedges
    for (let i = 0; i < d.halfedges.length; i++) {
        const i2 = d.halfedges[i];
        if (i2 !== -1 && d.halfedges[i2] !== i) {
            t.fail('invalid halfedge connection');
        }
    }
    t.pass('halfedges are valid');

    // validate triangulation
    const hullAreas = [];
    let e = d.hull;
    do {
        const [x0, y0] = points[e.prev.i];
        const [x, y] = points[e.i];
        hullAreas.push((x - x0) * (y + y0));
        e = e.next;
    } while (e !== d.hull);

    const hullArea = sum(hullAreas);

    const triangleAreas = [];
    for (let i = 0; i < d.triangles.length; i += 3) {
        const [ax, ay] = points[d.triangles[i]];
        const [bx, by] = points[d.triangles[i + 1]];
        const [cx, cy] = points[d.triangles[i + 2]];
        triangleAreas.push((by - ay) * (cx - bx) - (bx - ax) * (cy - by));
    }
    const trianglesArea = sum(triangleAreas);

    const err = Math.abs((hullArea - trianglesArea) / hullArea);
    if (err <= Math.pow(2, -51)) {
        t.pass(`triangulation is valid: ${err} error`);
    } else {
        t.fail(`triangulation is broken: ${err} error`);
    }
}

// Kahan and Babuska summation, Neumaier variant; accumulates less FP error
function sum(x) {
    let sum = x[0];
    let err = 0;
    for (let i = 1; i < x.length; i++) {
        const k = x[i];
        const m = sum + k;
        err += Math.abs(sum) >= Math.abs(k) ? sum - m + k : k - m + sum;
        sum = m;
    }
    return sum + err;
}
