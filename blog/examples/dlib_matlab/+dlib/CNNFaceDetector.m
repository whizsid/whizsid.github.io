classdef CNNFaceDetector < handle
    properties (Access = private)
        cpp_ptr
    end

    methods
        function this = CNNFaceDetector()
            this.cpp_ptr = dlib.CNNFaceDetectorMex('construct');
        end

        function copied_obj = clone(this)
            %Returns a new independent object that is a copy of this.
            copied_obj = CNNFaceDetector();
            copied_obj.cpp_ptr = dlib.CNNFaceDetectorMex(this.cpp_ptr,'clone');
        end

        function varargout = train(this, varargin) 
            [varargout{1:nargout}] = dlib.CNNFaceDetectorMex(this.cpp_ptr, 1, varargin{:}); 
        end 

        function varargout = detect(this, varargin) 
            [varargout{1:nargout}] = dlib.CNNFaceDetectorMex(this.cpp_ptr, 2, varargin{:}); 
        end 

    end

    methods(Access=private) 
        function delete(this) 
            dlib.CNNFaceDetectorMex(this.cpp_ptr); 
        end         
    end 

end
