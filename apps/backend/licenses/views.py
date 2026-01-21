from django.http import HttpResponse, JsonResponse
from datetime import datetime
from . import functions

from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from drf_yasg.utils import swagger_auto_schema
from drf_yasg import openapi

def index(request):
    return HttpResponse("Hello, world. You're at the licenses index.")

@swagger_auto_schema(
    tags=["LicenseCheck"],
    operation_summary="Vérifie les dates d'expiration des licenses",
    method="post",
    request_body=openapi.Schema(
        type=openapi.TYPE_OBJECT,
        required=["ref"],
        properties={
            "ref": openapi.Schema(type=openapi.TYPE_STRING),
        },
        example={
            "red": "XSP9999999"
        }
    ),
    responses={
    201: openapi.Response(
        description="ok",
        examples={
            "application/json": {
    "XSP9999990": {
        "name": "Microsoft Teams Essentials - Trial",
        "daysRemaining": 10,
        "expiryDate": "2025-05-14",
        "periodicity": "per Month",
        "term": "Month-to-Month",
        "isTrial": True,
        "seats": 25,
        "autoRenew": False
    },
    "XSP9999991": {
        "name": "Microsoft 365 Business Standard",
        "daysRemaining": -15,
        "expiryDate": "2025-09-03",
        "periodicity": "per Month",
        "term": "Month-to-Month",
        "isTrial": False,
        "seats": 3,
        "autoRenew": False
    }
}
        }
    )
}

)
@api_view(["POST"])
def submit_request(request):
    try:
        data = request.data
        licenses = functions.analyze_customer_licenses(data["ref"])
        response = {}
        for l in licenses:
            response[l["license_id"]] = {
                "name": l["name"],
                "daysRemaining": l["daysRemaining"],
                "expiryDate": datetime.fromisoformat(l["expiry_datetime"].replace("Z", "+00:00")).date(),
                "periodicity" : l["periodicity"],
                "term" : l["term"],
                "isTrial" : l["isTrial"],
                "seats" : l["seats"],
                "autoRenew" : l["autoRenew"],
            }
        return Response(response, status=201)
    
    except KeyError:
        return Response({"error": "Missing 'ref' field"}, status=400)
    
    except TypeError as e:
        return Response({"error": str(e)}, status=500)
