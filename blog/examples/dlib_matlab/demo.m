detector = dlib.CNNFaceDetector();
detector.train('./data/mmod_human_face_detector.dat');

I = imread("./input/students.jpg");
faces = detector.detect(I);

for i = 1:length(faces)
    bbox = cell2mat(faces(i));
    I = insertShape(I, 'Rectangle', bbox, 'LineWidth',5);
end

figure; imshow(I); title('Detected faces');