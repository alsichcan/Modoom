def accept_enrollment(modoom, profile):
    modoom.n_members += 1
    if modoom.n_members == modoom.accom:
        modoom.recruit = False
    modoom.save()
    profile.n_modooms += 1
    profile.save()


def delete_enrollment(modoom, profile):
    # n_members, n_modoms 수정
    if modoom.n_members == modoom.accom:
        modoom.recruit = True
    modoom.n_members -= 1
    modoom.save()
    profile.n_modooms -= 1
    profile.save()
