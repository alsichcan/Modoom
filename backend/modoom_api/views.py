from rest_framework.decorators import (
    api_view,
    authentication_classes,
    permission_classes,
)

from utils import *


@api_view(["GET"])
@authentication_classes([])
@permission_classes([])
def index(request):
    return make_response(success=True)
