#include <dlib/dnn.h>
#include <dlib/image_processing/full_object_detection.h>
#include <dlib/matrix/matrix.h>
#include <dlib/pixel.h>
#include <iostream>

using namespace std;
using namespace dlib;

template <long num_filters, typename SUBNET>
using con5d = con<num_filters, 5, 5, 2, 2, SUBNET>;
template <long num_filters, typename SUBNET>
using con5 = con<num_filters, 5, 5, 1, 1, SUBNET>;

template <typename SUBNET>
using downsampler = relu<affine<
    con5d<32, relu<affine<con5d<32, relu<affine<con5d<16, SUBNET>>>>>>>>>;
template <typename SUBNET> using rcon5 = relu<affine<con5<45, SUBNET>>>;

using net_type = loss_mmod<
    con<1, 9, 9, 1, 1,
        rcon5<rcon5<
            rcon5<downsampler<input_rgb_image_pyramid<pyramid_down<6>>>>>>>>;

class CNNFaceDetector {
public:
  CNNFaceDetector() {}

  void train(string fd_file_name) { deserialize(fd_file_name) >> _net; }

  void detect(const matrix<rgb_pixel> &img,
              std::vector<matrix_colmajor> &bboxes) {

    std::vector<mmod_rect> rects = _net(img);

    if (rects.size() > 0) {
      matrix_colmajor bbox = matrix_colmajor();
      bbox.set_size(1, 4);
      for (int i = 0; i < rects.size(); i++) {
        mmod_rect rect = rects[i];
        long t = rect.rect.top();
        long l = rect.rect.left();
        bbox(0, 0) = l;
        bbox(0, 1) = t;
        bbox(0, 2) = rect.rect.right() - l;
        bbox(0, 3) = rect.rect.bottom() - t;
        bboxes.push_back(bbox);
      }
    }
  }

private:
  net_type _net;
};

#define MEX_CLASS_NAME CNNFaceDetector
#define MEX_CLASS_METHODS train, detect

#include "mex_wrapper.cpp"
