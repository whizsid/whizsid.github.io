
cmake_minimum_required(VERSION 2.8.12)

PROJECT(mex_functions)

include(cmake_mex_wrapper)

find_package(dlib REQUIRED)

# You can tell cmake where to put the mex files when you run 'make install' by
# setting this variable.  The path is relative to this CMakeLists.txt file.
get_filename_component(MEX_INSTALL_PATH "${CMAKE_CURRENT_SOURCE_DIR}/../" ABSOLUTE)
set(install_target_output_folder ${MEX_INSTALL_PATH})


# Compile the example_mex_function.cpp file and link it to dlib.  Note
# that you can give a list of things to link to here.  E.g. 
#    add_mex_function(some_other_mex_function pthread dlib fftw) 
add_mex_function(CNNFaceDetectorMex dlib::dlib)

